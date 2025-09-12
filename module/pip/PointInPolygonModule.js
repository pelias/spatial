const Module = require('../Module')
const StatementPointInPolygon = require('./StatementPointInPolygon')
const StatementPointInPolygonVerbose = require('./StatementPointInPolygonVerbose')
const StatementPointInPolygonSummary = require('./StatementPointInPolygonSummary')
const TableSummary = require('./TableSummary')

class PointInPolygonModule extends Module {
  constructor (db) {
    super(db)
    this.table = {
      summary: new TableSummary()
    }
    this.statement = {
      pip: new StatementPointInPolygon(),
      verbose: new StatementPointInPolygonVerbose(),
      summary: new StatementPointInPolygonSummary()
    }
  }
}

module.exports = PointInPolygonModule
