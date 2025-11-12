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

    // Reduce the number of bytes required to represent a POINT geometry
    // note: this is a libspatialite-5.0.0 feature, databases generated with this setting
    // may not be read correctly by older versions of spatialite.
    // see: https://www.gaia-gis.it/fossil/libspatialite/wiki?name=BLOB-TinyPoint
    try {
      db.prepare(`SELECT EnableTinyPoint()`).get()
    } catch (e) {
      this.error('EnableTinyPoint', e)
    }
  }
}

module.exports = InitSpatialOptions
