const _ = require('lodash')
const Sqlite = require('../../sqlite/Sqlite')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')

// initialize spatial reference table
class InitSpatialMetaData extends Sqlite {
  create (db, config) {
    try {
      if (_.get(config, 'readonly', false) === false) {
        let introspect = new SqliteIntrospect(db)
        let hasSpatialRefSysTable = !!introspect.columns('spatial_ref_sys', config).length
        if (!hasSpatialRefSysTable) {
          db.prepare(`SELECT InitSpatialMetaData(1)`).get()
        }
      }
    } catch (e) {
      this.error('InitSpatialMetaData', e)
    }
  }
}

module.exports = InitSpatialMetaData
