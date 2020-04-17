const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class TriggerGeometryInsert extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      let complexity = _.clamp(_.get(config, 'module.shard.complexity', 200), 5, 1000000)
      db.prepare(`
        CREATE TRIGGER IF NOT EXISTS shard_geometry_insert
        AFTER INSERT ON ${dbname}.geometry
        -- only polygon types currently supported
        WHEN GeometryType( NEW.geom ) IN ('POLYGON', 'MULTIPOLYGON')
        AND UPPER( NEW.role ) IN ( 'BOUNDARY', 'BUFFER' )
        BEGIN

          -- remove prior shards for same geometry
          DELETE FROM shard
          WHERE source = NEW.source
          AND id = NEW.id;

          -- insert collection into tmp table
          INSERT INTO shard_subdivide (geom)
          SELECT ST_Subdivide(NEW.geom, ${complexity})
          WHERE NEW.geom IS NOT NULL;

          -- insert shards in to shard table
          INSERT INTO shard (source, id, role, element, geom)
          SELECT
            NEW.source,
            NEW.id,
            NEW.role,
            t.item_no,
            t.geometry
          FROM ElementaryGeometries AS t
          WHERE f_table_name = 'shard_subdivide'
          AND origin_rowid = last_insert_rowid();

          -- truncate & reset tmp table
          DELETE FROM shard_subdivide;
          DELETE from sqlite_sequence WHERE name='shard_subdivide';
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
        DROP TRIGGER IF EXISTS ${dbname}.shard_geometry_insert
      `).run()
    } catch (e) {
      this.error('DROP TRIGGER', e)
    }
  }
}

module.exports = TriggerGeometryInsert
