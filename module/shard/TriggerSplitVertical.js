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
        WHEN (NEW.depth % 2) = 1
        AND NEW.depth < ${depth}
        AND IFNULL( NEW.complexity, 0 ) > ${complexity}
        AND IsValid( NEW.geom )
        BEGIN
          INSERT OR REPLACE INTO shard( source, id, parity, depth, geom )

          /* top half */
          SELECT
            NEW.source, NEW.id, 3, NEW.depth + 1,
            CastToMultiPolygon(Intersection(NEW.geom, BuildMbr(
              MbrMinX( geom ),
              MbrMinY( geom ),
              MbrMaxX( geom ),
              MbrMinY( geom ) + (( MbrMaxY( geom ) - MbrMinY( geom )) / 2)
            ))) AS quad
          FROM shard
          WHERE shard.rowid = NEW.rowid
          AND quad IS NOT NULL

          UNION

          /* bottom half */
          SELECT
            NEW.source, NEW.id, 4, NEW.depth + 1,
            CastToMultiPolygon(Intersection(NEW.geom, BuildMbr(
              MbrMinX( geom ),
              MbrMinY( geom ) + (( MbrMaxY( geom ) - MbrMinY( geom )) / 2),
              MbrMaxX( geom ),
              MbrMaxY( geom )
            ))) AS quad
          FROM shard
          WHERE shard.rowid = NEW.rowid
          AND quad IS NOT NULL;

          /* clean up */
          DELETE FROM shard
          WHERE rowid = NEW.rowid
          AND depth = NEW.depth
          AND IFNULL( NEW.complexity, 0 ) > ${complexity}
          AND IsValid( NEW.geom );
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
