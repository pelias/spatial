const SqliteIndex = require('../../sqlite/SqliteIndex')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')

// note: spatialite only allows creation of geometry columns on the 'main' database.
// see: https://groups.google.com/forum/#!topic/spatialite-users/rRMSHk2Lt38

class GeoIndexGeom extends SqliteIndex {
  create (db) {
    let introspect = new SqliteIntrospect(db)
    let hasGeoColumn = introspect.columns('shard').some(c => c.name === 'geom')

    // if geom field not already defined (cannot use NOT EXISTS on geometry columns)
    if (!hasGeoColumn) {
      // create spatial index
      try {
        db.prepare(`
          SELECT CreateSpatialIndex('shard', 'geom')
      `).get()
      } catch (e) {
        this.error('CREATE SPATIAL INDEX', e)
      }
    }
  }
  drop (db) {
    let introspect = new SqliteIntrospect(db)
    let hasGeoColumn = introspect.columns('shard').some(c => c.name === 'geom')

    // ensure column is defined
    if (hasGeoColumn) {
      // disable spatial index
      try {
        db.prepare(`
          SELECT DisableSpatialIndex('shard', 'geom')
      `).get()
      } catch (e) {
        this.error('DISABLE SPATIAL INDEX', e)
      }
    }
  }
}

module.exports = GeoIndexGeom
