const through = require('through2')
const Database = require('better-sqlite3')
const ServiceConfiguration = require('../config/ServiceConfiguration')
const Spatialite = require('../module/spatialite/Spatialite')
const Place = require('../module/place/Place')
const Property = require('../module/property/Property')
const Geometry = require('../module/geometry/Geometry')
const Shard = require('../module/shard/Shard')
const Hierarchy = require('../module/hierarchy/Hierarchy')
const PointInPolygon = require('../module/pip/PointInPolygon')
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
      spatialite: new Spatialite(this.db),
      place: new Place(this.db),
      property: new Property(this.db),
      geometry: new Geometry(this.db),
      shard: new Shard(this.db),
      hierarchy: new Hierarchy(this.db),
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
  createImportStream () {
    let stats = { error: 0, imports: 0, place: 0, property: 0, geometry: 0, shard: 0 }

    ticker.addIncrementOperation('error', () => stats.error)
    ticker.addIncrementOperation('imports', () => stats.place, true, true)
    // ticker.addIncrementOperation('place', () => stats.place)
    // ticker.addIncrementOperation('property', () => stats.property)
    // ticker.addIncrementOperation('geometry', () => stats.place)
    // ticker.addIncrementOperation('shard', () => stats.place)

    return through.obj((doc, _, next) => {
      try {
        const transaction = this.db.transaction(doc => {
          let info

          info = this.module.place.insert(doc, this.config)
          if (info && info.changes) { stats.place += info.changes }

          info = this.module.property.insert(doc, this.config)
          if (info && info.changes) { stats.property += info.changes }

          info = this.module.geometry.insert(doc, this.config)
          if (info && info.changes) { stats.geometry += info.changes }

          info = this.module.shard.insert(doc, this.config)
          if (info && info.changes) { stats.shard += info.changes }

          info = this.module.hierarchy.insert(doc, this.config)
          if (info && info.changes) { stats.hierarchy += info.changes }
        })
        transaction(doc)

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
