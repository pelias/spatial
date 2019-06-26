const Module = require('../Module')
const TableGeometry = require('./TableGeometry')
const IndexIdentityUnique = require('./IndexIdentityUnique')
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
      identity: new IndexIdentityUnique(),
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
