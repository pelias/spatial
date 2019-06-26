const Module = require('../Module')
const TableGeometry = require('./TableGeometry')
const IndexCovering = require('./IndexCovering')
const GeoColumnGeom = require('./GeoColumnGeom')
const GeoIndexGeom = require('./GeoIndexGeom')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')

class Geometry extends Module {
  constructor (db) {
    super(db)
    this.table = {
      area: new TableGeometry(),
      geom: new GeoColumnGeom()
    }
    this.index = {
      covering: new IndexCovering(),
      geometry: new GeoIndexGeom()
    }
    this.statement = {
      insert: new StatementInsert(),
      fetch: new StatementFetch()
    }
  }
  insert (doc) {
    return this.statement.insert.run({
      source: doc.source.toString(),
      id: doc.source_id.toString(),
      geom: doc.geometry.toWkb()
    })
  }
}

module.exports = Geometry
