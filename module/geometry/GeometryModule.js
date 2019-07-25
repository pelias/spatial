const Module = require('../Module')
const TableGeometry = require('./TableGeometry')
const IndexIdentityUnique = require('./IndexIdentityUnique')
const IndexGeometryType = require('./IndexGeometryType')
const GeoColumnGeom = require('./GeoColumnGeom')
const GeoIndexGeom = require('./GeoIndexGeom')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')
const TriggerComputeCentroid = require('./TriggerComputeCentroid')
const TriggerComputeEnvelope = require('./TriggerComputeEnvelope')

class GeometryModule extends Module {
  constructor (db) {
    super(db)
    this.table = {
      geometry: new TableGeometry(),
      geom: new GeoColumnGeom()
    }
    this.index = {
      identity: new IndexIdentityUnique(),
      geometryType: new IndexGeometryType(),
      geometry: new GeoIndexGeom()
    }
    this.statement = {
      insert: new StatementInsert(),
      fetch: new StatementFetch()
    }
    this.trigger = {
      centroid: new TriggerComputeCentroid(),
      envelope: new TriggerComputeEnvelope()
    }
  }
  insert (place) {
    let info = { changes: 0, lastInsertRowid: 0 }
    place.geometry.forEach(geometry => {
      // insert geometry
      let _info = this.statement.insert.run({
        source: place.identity.source,
        id: place.identity.id,
        role: geometry.role,
        geom: geometry.geometry.toWkb()
      })

      // update aggregate info
      info.changes += _info.changes
      info.lastInsertRowid = _info.lastInsertRowid
    })
    return info
  }
}

module.exports = GeometryModule
