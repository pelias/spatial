// const fs = require('fs')
// const os = require('os')
// const spawnSync = require('child_process').spawnSync
const path = require('path')
const Sqlite = require('../../sqlite/Sqlite')

const searchPaths = [{
  extpath: '/usr/lib/x86_64-linux-gnu',
  extinit: 'libspatialite.so'
}, {
  //   extpath: '/usr/lib/x86_64-linux-gnu',
  //   extinit: 'mod_spatialite'
  // }, {
  extpath: '/code/build/tmp/libspatialite-5.0.0-beta1/src/.libs/',
  extinit: 'libspatialite.so'
}, {
  //   extpath: '/code/build/tmp/libspatialite-5.0.0-beta1/src/.libs/',
  //   extinit: 'mod_spatialite'
  // }, {
  //   extpath: '',
  //   extinit: 'libspatialite.so'
  // }, {
  extpath: '',
  extinit: 'mod_spatialite'
}]

// const EXTENSION_PATHS = [
//   '/usr/lib/x86_64-linux-gnu',
//   // path.resolve(__dirname, '../../build/', os.platform() + '-' + os.arch()),
//   // path.resolve(__dirname, '../../build/tmp/libspatialite/src/.libs'),
//   path.resolve(__dirname, '../../build/tmp/libspatialite-5.0.0-beta1/src/.libs'),
//   // '/lib/x86_64-linux-gnu',
//   // '/usr/lib/x86_64-linux-gnu',
//   // '/usr/local/lib',
//   ''
// ]

// const EXTENSION_INIT = [
//   // process.env.SPATIALITE_EXTENSION_INIT || '',
//   'libspatialite.so',
//   // 'libspatialite.so.5',
//   'mod_spatialite',
//   // 'mod_spatialite.so',
//   // 'mod_spatialite.dylib'
// ]

// load the spatialite extension
class InitExtension extends Sqlite {
  load (db) {
    // console.error('sleep 5')
    // spawnSync('sleep', ['5'])
    // console.error('slept')

    console.error('InitExtension.load()')
    // for (let extpath of EXTENSION_PATHS) {
    //   for (let extinit of EXTENSION_INIT) {
    for (let lib of searchPaths) {
      console.error('lib', lib)
      const extpath = lib.extpath
      const extinit = lib.extinit
      try {
        var p = path.join(extpath, extinit)
        console.error('p', p)
        // console.error(extpath, extinit)

        // spawnSync('sleep', ['2'])

        // var exists = fs.existsSync(p)
        // var exists2 = fs.existsSync(`${p}.so`)
        // // console.error('exists', exists)
        // if (!exists && !exists2){
        //   // console.error('could have skipped, but didnt')
        //   // continue
        // }

        console.error(`loadExtension('${p}')`)
        db.loadExtension(p)
        // console.error(ret.prepare(`SELECT * FROM sqlite_master`).all())
        // console.error('return', ret)
        // console.error('return true')
        return true
      } catch (e) {
        // console.error(e)
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
