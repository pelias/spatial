const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class TriggerSplitVertical extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      let complexity = _.clamp(_.get(config, 'module.shard.complexity', 200), 5, 1000000)
      let depth = _.clamp(_.get(config, 'module.shard.depth', 50), 0, 1000)
      db.prepare(`
        CREATE TRIGGER IF NOT EXISTS shard_split_vertical_trigger
        AFTER UPDATE OF complexity ON ${dbname}.shard
        WHEN ( LENGTH( NEW.path ) % 2 ) = 0
        AND LENGTH( NEW.path ) <= ${depth}
        AND IFNULL( NEW.complexity, 0 ) > ${complexity}
        AND IsValid( NEW.geom ) = 1
        BEGIN
          INSERT OR REPLACE INTO shard( source, id, path, geom )

          /* top half */
          SELECT
            NEW.source, NEW.id, NEW.path || '3',
            CastToMultiPolygon(Intersection(NEW.geom, BuildMbr(
              MbrMinX( geom ),
              MbrMinY( geom ),
              MbrMaxX( geom ),
              MbrMinY( geom ) + (( MbrMaxY( geom ) - MbrMinY( geom )) / 2)
            ))) AS geom
          FROM shard
          WHERE shard.rowid = NEW.rowid
          AND IsValid( geom ) = 1

          UNION ALL

          /* bottom half */
          SELECT
            NEW.source, NEW.id, NEW.path || '4',
            CastToMultiPolygon(Intersection(NEW.geom, BuildMbr(
              MbrMinX( geom ),
              MbrMinY( geom ) + (( MbrMaxY( geom ) - MbrMinY( geom )) / 2),
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
        DROP TRIGGER IF EXISTS ${dbname}.shard_split_vertical_trigger
      `).run()
    } catch (e) {
      this.error('DROP TRIGGER', e)
    }
  }
}

module.exports = TriggerSplitVertical
