const _ = require('lodash')
const Sqlite = require('../../sqlite/Sqlite')

// display installed versions
class InitDebugVersions extends Sqlite {
  create (db, config) {
    try {
      if (_.get(config, 'verbose', false) !== true) { return }
      console.error(db.prepare(`
        SELECT
          sqlite_version() AS sqlite_version,
          spatialite_version() AS spatialite_version
      `).get())
    } catch (e) {
      this.error('VERSIONS', e)
    }
  }
}

module.exports = InitDebugVersions
