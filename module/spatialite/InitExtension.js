const Sqlite = require('../../sqlite/Sqlite')

// load the spatialite extension
class InitExtension extends Sqlite {
  create (db) {
    try {
      db.loadExtension('mod_spatialite')
    } catch (e) {
      this.error('LOAD EXTENSION', e)
      process.exit(1) // fatal error
    }
  }
}

module.exports = InitExtension
