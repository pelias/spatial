const Database = require('better-sqlite3')
const ServiceConfiguration = require('../config/ServiceConfiguration')
const Spatialite = require('../module/spatialite/Spatialite')
const Place = require('../module/place/Place')
const Property = require('../module/property/Property')
const Geometry = require('../module/geometry/Geometry')
const PointInPolygon = require('../module/pip/PointInPolygon')
const Hierarchy = require('../module/hierarchy/Hierarchy')

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
      place: new Place(this.db),
      property: new Property(this.db),
      geometry: new Geometry(this.db),
      pip: new PointInPolygon(this.db),
      hierarchy: new Hierarchy(this.db)
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
