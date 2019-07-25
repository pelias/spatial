const Module = require('../Module')
const GeoViewPointInPolygon = require('../shard/GeoViewPointInPolygon')
const StatementPointInPolygon = require('./StatementPointInPolygon')
const StatementPointInPolygonVerbose = require('./StatementPointInPolygonVerbose')

class PointInPolygonModule extends Module {
  constructor (db) {
    super(db)
    this.statement = {
      pip: new StatementPointInPolygon(),
      verbose: new StatementPointInPolygonVerbose()
    }
    this.view = {
      pip: new GeoViewPointInPolygon()
    }
  }
}

module.exports = PointInPolygonModule
