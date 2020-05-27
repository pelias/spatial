const os = require('os')
const path = require('path')
const _ = require('lodash')
const Database = require('better-sqlite3')
const SpatialiteModule = require('../module/spatialite/SpatialiteModule')
const DEFAULTS = { tmpdir: os.tmpdir() }

module.exports = {
  randomFileName: () => `${Math.random().toString(36).substring(8)}.db`,
  tempDatabase: (config) => {
    let options = _.extend({}, DEFAULTS, config || {})
    if (typeof options.tmpName !== 'string') { options.tmpName = module.exports.randomFileName() }
    let tmpPath = path.join(options.tmpdir, options.tmpName)
    if (options.memory) { tmpPath = ':memory:' }
    delete options.memory
    return new Database(tmpPath, options)
  },
  tempSpatialDatabase: (config) => {
    let db = module.exports.tempDatabase(config)
    let mod = new SpatialiteModule(db)
    mod.setup()
    return db
  }
}
