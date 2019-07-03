const os = require('os')
const path = require('path')
const _ = require('lodash')
const Database = require('better-sqlite3')
const Spatialite = require('../module/spatialite/Spatialite')
const DEFAULTS = { memory: true, tmpdir: os.tmpdir() }

module.exports = {
  randomFileName: () => `${Math.random().toString(36).substring(8)}.db`,
  tempDatabase: (config) => {
    let options = _.extend({}, DEFAULTS, config || {})
    if (typeof options.tmpName !== 'string') { options.tmpName = module.exports.randomFileName() }
    let tmpPath = path.join(options.tmpdir, options.tmpName)
    return new Database(tmpPath, options)
  },
  tempSpatialDatabase: (config) => {
    let db = module.exports.tempDatabase(config)
    let mod = new Spatialite(db)
    mod.setup()
    return db
  }
}
