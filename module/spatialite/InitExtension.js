const Sqlite = require('../../sqlite/Sqlite')

// load the spatialite extension
class InitExtension extends Sqlite {
  load (db) {
    db.loadExtension('mod_spatialite')
    return true
  }
  create (db) {
    if (!this.load(db)) {
      this.error('LOAD EXTENSION')
      process.exit(1) // fatal error
    }
  }
}

module.exports = InitExtension
