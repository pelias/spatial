const Module = require('../Module')
const StatementRelationship = require('./StatementRelationship')

class RelationshipModule extends Module {
  constructor (db) {
    super(db)
    this.statement = {
      intersects: new StatementRelationship('intersects'),
      contains: new StatementRelationship('contains'),
      within: new StatementRelationship('within')
    }
  }
}

module.exports = RelationshipModule
