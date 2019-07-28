const Database = require('better-sqlite3')
const ServiceConfiguration = require('../config/ServiceConfiguration')
const SpatialiteModule = require('../module/spatialite/SpatialiteModule')
const PlaceModule = require('../module/place/PlaceModule')
const PropertyModule = require('../module/property/PropertyModule')
const GeometryModule = require('../module/geometry/GeometryModule')
const PointInPolygonModule = require('../module/pip/PointInPolygonModule')
const HierarchyModule = require('../module/hierarchy/HierarchyModule')
const NameModule = require('../module/name/NameModule')
const SearchModule = require('../module/search/SearchModule')
const RelationshipModule = require('../module/relationship/RelationshipModule')

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
      spatialite: new SpatialiteModule(this.db),
      place: new PlaceModule(this.db),
      property: new PropertyModule(this.db),
      geometry: new GeometryModule(this.db),
      pip: new PointInPolygonModule(this.db),
      hierarchy: new HierarchyModule(this.db),
      name: new NameModule(this.db),
      search: new SearchModule(this.db),
      relationship: new RelationshipModule(this.db)
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
