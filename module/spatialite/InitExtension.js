const os = require('os')
const path = require('path')
const Sqlite = require('../../sqlite/Sqlite')

const EXTENSION_PATHS = [
  path.resolve(__dirname, '../../build/', os.platform() + '-' + os.arch()),
  path.resolve(__dirname, '../../build/tmp/libspatialite-5.0.0-beta0/src/.libs'),
  process.env.SPATIALITE_EXTENSION_PATH,
  ''
]

const EXTENSION_INIT = [
  'mod_spatialite',
  'mod_spatialite.so',
  'mod_spatialite.dylib',
  'libspatialite.so',
  'libspatialite.so.5',
  'libspatialite.so',
  process.env.SPATIALITE_EXTENSION_INIT
]

// load the spatialite extension
class InitExtension extends Sqlite {
  load (db) {
    for (let extpath of EXTENSION_PATHS) {
      for (let extinit of EXTENSION_INIT) {
        try {
          db.loadExtension(path.join(extpath, extinit))
          return true
        } catch (e) { }
      }
    }
    return false
  }
  create (db) {
    if (!this.load(db)) {
      this.error('LOAD EXTENSION')
      process.exit(1) // fatal error
    }
  }
}

module.exports = InitExtension
