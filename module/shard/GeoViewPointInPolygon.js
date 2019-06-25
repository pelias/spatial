const _ = require('lodash')
const SqliteIndex = require('../../sqlite/SqliteIndex')

class GeoViewPointInPolygon extends SqliteIndex {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')

      // create sqlite view
      db.prepare(`
        CREATE VIEW IF NOT EXISTS ${dbname}.point_in_polygon AS
        SELECT *
        FROM SpatialIndex AS s
        LEFT JOIN shard ON s.ROWID = shard.rowid
        WHERE f_table_name = 'shard'
        AND f_geometry_column = 'geom'
      `).run()

      // must be registered as a spatial view
      db.prepare(`
        INSERT OR REPLACE INTO views_geometry_columns (
          view_name,
          view_geometry,
          view_rowid,
          f_table_name,
          f_geometry_column,
          read_only
        ) VALUES (
          'point_in_polygon',
          'geom',
          'rowid',
          'shard',
          'geom',
          1
        )
      `).run()
    } catch (e) {
      this.error('CREATE VIEW', e)
    }
  }
  drop (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')

      // deregister spatial view
      db.prepare(`
        DELETE FROM views_geometry_columns
        WHERE view_name = 'point_in_polygon'
      `).run()

      // drop sqlite view
      db.prepare(`
        DROP VIEW IF EXISTS ${dbname}.point_in_polygon
      `).run()
    } catch (e) {
      this.error('DROP VIEW', e)
    }
  }
}

module.exports = GeoViewPointInPolygon
