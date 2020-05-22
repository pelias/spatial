const _ = require('lodash')
const fs = require('fs')
const Sqlite = require('../../sqlite/Sqlite')
const runtime = _.get(process, 'env.RUNTIME', '/opt/spatial')

// prepend a new path to an env var
const prependEnvPath = (name, path, delim = ':') => {
  const existing = _.get(process.env, name, '')
  _.set(process.env, name, [path, existing].join(delim))
}

// detect and load runtime environment
if (fs.existsSync(runtime)) {
  prependEnvPath('LD_LIBRARY_PATH', `${runtime}/lib`) // set linux search paths
  prependEnvPath('DYLD_LIBRARY_PATH', `${runtime}/lib`) // set mac search paths
  prependEnvPath('PROJ_LIB', `${runtime}/data`) // set GEOS data path
}

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
    for (let extinit of EXTENSION_INIT) {
      try {
        db.loadExtension(extinit)
        return true
      } catch (e) { }
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
