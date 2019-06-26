const Database = require('better-sqlite3')
const ServiceConfiguration = require('../config/ServiceConfiguration')
const Spatialite = require('../module/spatialite/Spatialite')
const Document = require('../module/document/Document')
const Property = require('../module/property/Property')
const PointInPolygon = require('../module/pip/PointInPolygon')

class QueryService {
  constructor (config) {
    // instatiate service config
    this.config = new ServiceConfiguration(config)

    // set up database connection
    let dbconf = {}
    if (this.config.readonly === true) { dbconf.readonly = true }
    if (this.config.verbose === true) { dbconf.verbose = console.error }
    this.db = new Database(this.config.filename, dbconf)

    // set up modules
    this.module = {
      spatialite: new Spatialite(this.db),
      document: new Document(this.db),
      property: new Property(this.db),
      pip: new PointInPolygon(this.db)
    }

    // attach external databases
    // note: disabled for now
    // if (config.database !== 'main') {
    //   this.db.prepare(`ATTACH DATABASE '${config.filename}' AS '${config.database}'`).run()
    // }

    // run pragmas
    for (let name in this.config.pragma) {
      this.config.pragma[name].run(this.db, config)
    }

    // setup modules
    for (let name in this.module) {
      this.module[name].setup(this.config)
    }
  }
}

module.exports = QueryService
