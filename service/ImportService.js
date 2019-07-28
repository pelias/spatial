const through = require('through2')
const Database = require('better-sqlite3')
const ServiceConfiguration = require('../config/ServiceConfiguration')
const SpatialiteModule = require('../module/spatialite/SpatialiteModule')
const PlaceModule = require('../module/place/PlaceModule')
const PropertyModule = require('../module/property/PropertyModule')
const GeometryModule = require('../module/geometry/GeometryModule')
const ShardModule = require('../module/shard/ShardModule')
const HierarchyModule = require('../module/hierarchy/HierarchyModule')
const NameModule = require('../module/name/NameModule')
const SearchModule = require('../module/search/SearchModule')
const PointInPolygonModule = require('../module/pip/PointInPolygonModule')
const ticker = require('../import/ticker')

class ImportService {
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
      shard: new ShardModule(this.db),
      hierarchy: new HierarchyModule(this.db),
      name: new NameModule(this.db),
      search: new SearchModule(this.db),
      pip: new PointInPolygonModule(this.db)
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
  createImportStream () {
    let stats = { error: 0, imports: 0, place: 0, property: 0, geometry: 0, name: 0, shard: 0 }

    ticker.addIncrementOperation('error', () => stats.error)
    ticker.addIncrementOperation('imports', () => stats.place, true, true)
    // ticker.addIncrementOperation('place', () => stats.place)
    // ticker.addIncrementOperation('property', () => stats.property)
    // ticker.addIncrementOperation('geometry', () => stats.place)
    // ticker.addIncrementOperation('shard', () => stats.place)

    return through.obj((place, _, next) => {
      try {
        const transaction = this.db.transaction(place => {
          let info

          info = this.module.place.insert(place, this.config)
          if (info && info.changes) { stats.place += info.changes }

          info = this.module.property.insert(place, this.config)
          if (info && info.changes) { stats.property += info.changes }

          info = this.module.geometry.insert(place, this.config)
          if (info && info.changes) { stats.geometry += info.changes }

          info = this.module.hierarchy.insert(place, this.config)
          if (info && info.changes) { stats.hierarchy += info.changes }

          info = this.module.name.insert(place, this.config)
          if (info && info.changes) { stats.name += info.changes }
        })
        transaction(place)

        // process.stderr.write('✓')
        stats.imports++
      } catch (e) {
        console.error('INSERT FAILED', e)
        // process.stderr.write('✗')
        stats.error++
      }
      next()
    })
  }
}

module.exports = ImportService
