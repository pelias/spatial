const format = require('../../import/format')
const Module = require('../Module')
const TableShard = require('./TableShard')
const IndexCovering = require('./IndexCovering')
const IndexPath = require('./IndexPath')
const IndexComplexity = require('./IndexComplexity')
const GeoColumnGeom = require('./GeoColumnGeom')
const GeoIndexGeom = require('./GeoIndexGeom')
const StatementInsert = require('./StatementInsert')
const TriggerComplexity = require('./TriggerComplexity')
const TriggerSplitHorizontal = require('./TriggerSplitHorizontal')
const TriggerSplitVertical = require('./TriggerSplitVertical')
const GeoViewPointInPolygon = require('./GeoViewPointInPolygon')

class Shard extends Module {
  constructor (db) {
    super(db)
    this.table = {
      shard: new TableShard(),
      geom: new GeoColumnGeom()
    }
    this.index = {
      covering: new IndexCovering(),
      path: new IndexPath(),
      complexity: new IndexComplexity(),
      geom: new GeoIndexGeom()
    }
    this.statement = {
      insert: new StatementInsert()
    }
    this.trigger = {
      complexity: new TriggerComplexity(),
      horizontal: new TriggerSplitHorizontal(),
      vertical: new TriggerSplitVertical()
    }
    this.view = {
      pip: new GeoViewPointInPolygon()
    }
  }
  insert (doc) {
    // only polygon types currently supported
    // @todo optionally buffer point geoms
    if (!format.type(doc.geometry).endsWith('POLYGON')) {
      return
    }

    return this.statement.insert.run({
      source: doc.source.toString(),
      id: doc.source_id.toString(),
      geom: doc.geometry.toWkb()
    })
  }
}

module.exports = Shard
