const Sqlite = require('../../sqlite/Sqlite')

// initialize spatial reference table
class InitSpatialOptions extends Sqlite {
  create (db) {
    // Explicitly sets the number of decimal digits (precision) to be displayed by ST_AsText()
    try {
      db.prepare(`SELECT SetDecimalPrecision(7)`).get()
    } catch (e) {
      this.error('SetDecimalPrecision', e)
    }
  }
}

module.exports = InitSpatialOptions
