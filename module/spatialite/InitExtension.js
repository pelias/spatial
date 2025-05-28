const os = require('os')
const fs = require('fs')
const path = require('path')
const Sqlite = require('../../sqlite/Sqlite')
const modulePaths = ['mod_spatialite']

// support for homebrew: `brew install libspatialite`
const homebrewDir = '/opt/homebrew/Cellar/libspatialite'
if (os.platform() === 'darwin' && fs.existsSync(homebrewDir)) {
  modulePaths.push(
    ...fs.readdirSync(homebrewDir, { recursive: true })
      .filter(f => f.endsWith('mod_spatialite.dylib'))
      .map(f => path.join(homebrewDir, f))
      .sort().reverse()
  )
}

// load the spatialite extension
class InitExtension extends Sqlite {
  load (db) {
    for (const path of modulePaths) {
      try {
        db.loadExtension(path)
        return true
      } catch (e) {}
    }
    throw new Error('failed to load spatialite extension')
  }
  create (db) {
    if (!this.load(db)) {
      this.error('LOAD EXTENSION')
      process.exit(1) // fatal error
    }
  }
}

module.exports = InitExtension
