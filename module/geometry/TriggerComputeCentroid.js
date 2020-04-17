const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

/**
 * note: Using a zero-width buffer cleans up many topology problems.
 * Buffer(0) is used to improve support for topologically invalid geometries.
 */

class TriggerComputeCentroid extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE TRIGGER IF NOT EXISTS geometry_compute_centroid
        AFTER INSERT ON ${dbname}.geometry
        -- only polygon types supported
        WHEN GeometryType( NEW.geom ) IN ('POLYGON', 'MULTIPOLYGON')
        AND UPPER( NEW.role ) = 'BOUNDARY'
        BEGIN
          INSERT OR IGNORE INTO geometry ( source, id, role, geom )
          VALUES ( NEW.source, NEW.id, 'centroid', IFNULL(
            PointOnSurface( NEW.geom ),
            PointOnSurface( Buffer( NEW.geom, 0 ) )
          ));
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
        DROP TRIGGER IF EXISTS ${dbname}.geometry_compute_centroid
      `).run()
    } catch (e) {
      this.error('DROP TRIGGER', e)
    }
  }
}

module.exports = TriggerComputeCentroid
