const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class TriggerSplitHorizontal extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      let complexity = _.clamp(_.get(config, 'module.shard.complexity', 200), 5, 1000000)
      let depth = _.clamp(_.get(config, 'module.shard.depth', 50), 0, 1000)
      db.prepare(`
        CREATE TRIGGER IF NOT EXISTS shard_split_horizontal_trigger
        AFTER UPDATE OF complexity ON ${dbname}.shard
        WHEN ( LENGTH( NEW.path ) % 2 ) = 1
        AND LENGTH( NEW.path ) <= ${depth}
        AND IFNULL( NEW.complexity, 0 ) > ${complexity}
        AND IsValid( NEW.geom ) = 1
        BEGIN
          INSERT OR REPLACE INTO shard( source, id, path, geom )

          /* left half */
          SELECT
            NEW.source, NEW.id, NEW.path || '1',
            CastToMultiPolygon(Intersection(NEW.geom, BuildMbr(
              MbrMinX(NEW.geom),
              MbrMinY(NEW.geom),
              MbrMinX(NEW.geom) + ((MbrMaxX(NEW.geom) - MbrMinX(NEW.geom)) / 2),
              MbrMaxY(NEW.geom)
            ))) AS geom
          FROM shard
          WHERE shard.rowid = NEW.rowid
          AND IsValid( geom ) = 1

          UNION ALL

          /* right half */
          SELECT
            NEW.source, NEW.id, NEW.path || '2',
            CastToMultiPolygon(Intersection(NEW.geom, BuildMbr(
              MbrMinX( geom ) + (( MbrMaxX( geom ) - MbrMinX( geom )) / 2),
              MbrMinY( geom ),
              MbrMaxX( geom ),
              MbrMaxY( geom )
            ))) AS geom
          FROM shard
          WHERE shard.rowid = NEW.rowid
          AND IsValid( geom ) = 1;

          /* clean up */
          DELETE FROM shard
          WHERE rowid = NEW.rowid
          AND CHANGES() == 2;
        END
      `).run()
    } catch (e) {
      this.error('CREATE TRIGGER', e)
    }
  }
  drop (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        DROP TRIGGER IF EXISTS ${dbname}.shard_split_horizontal_trigger
      `).run()
    } catch (e) {
      this.error('DROP TRIGGER', e)
    }
  }
}

module.exports = TriggerSplitHorizontal
