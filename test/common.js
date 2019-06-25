const _ = require('lodash')
const Database = require('better-sqlite3')
const Spatialite = require('../module/spatialite/Spatialite')

module.exports = {
  randomFileName: () => `${Math.random().toString(36).substring(8)}.db`,
  tempDatabase: (config) => new Database(module.exports.randomFileName(), _.extend(config, { memory: true })),
  tempSpatialDatabase: (config) => {
    let db = module.exports.tempDatabase(config)
    let mod = new Spatialite(db)
    mod.setup()
    return db
  }
}
