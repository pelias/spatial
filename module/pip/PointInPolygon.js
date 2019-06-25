const Module = require('../Module')
const GeoViewPointInPolygon = require('../shard/GeoViewPointInPolygon')
const StatementPointInPolygon = require('./StatementPointInPolygon')

class PointInPolygon extends Module {
  constructor (db) {
    super(db)
    this.statement = {
      pip: new StatementPointInPolygon()
    }
    this.view = {
      pip: new GeoViewPointInPolygon()
    }
  }
}

module.exports = PointInPolygon
