const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class TriggerComputeCentroid extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE TRIGGER IF NOT EXISTS geometry_compute_centroid
        AFTER INSERT ON ${dbname}.geometry
        -- only polygon types supported
        WHEN GeometryType( NEW.geom ) LIKE '%POLYGON'
        BEGIN
          INSERT OR IGNORE INTO geometry ( source, id, role, geom )
          VALUES ( NEW.source, NEW.id, 'centroid', PointOnSurface( NEW.geom ) );
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
