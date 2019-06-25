const through = require('through2')
const Database = require('better-sqlite3')
const ServiceConfiguration = require('../config/ServiceConfiguration')
const Spatialite = require('../module/spatialite/Spatialite')
const Document = require('../module/document/Document')
const Geometry = require('../module/geometry/Geometry')
const Shard = require('../module/shard/Shard')
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
      document: new Document(this.db),
      geometry: new Geometry(this.db),
      shard: new Shard(this.db),
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
    let stats = { error: 0, imports: 0, document: 0, geometry: 0, shard: 0 }

    ticker.addIncrementOperation('error', () => stats.error)
    ticker.addIncrementOperation('imports', () => stats.document, true, true)
    // ticker.addIncrementOperation('document', () => stats.document)
    // ticker.addIncrementOperation('geometry', () => stats.document)
    // ticker.addIncrementOperation('shard', () => stats.document)

    return through.obj((doc, _, next) => {
      try {
        const transaction = this.db.transaction(doc => {
          let info

          info = this.module.document.insert(doc, this.config)
          if (info && info.changes) { stats.document += info.changes }

          info = this.module.geometry.insert(doc, this.config)
          if (info && info.changes) { stats.geometry += info.changes }

          info = this.module.shard.insert(doc, this.config)
          if (info && info.changes) { stats.shard += info.changes }
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
