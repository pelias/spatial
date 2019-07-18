const Module = require('../Module')
const TablePlace = require('./TablePlace')
const IndexCovering = require('./IndexCovering')
const IndexIdentityUnique = require('./IndexIdentityUnique')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')

class PlaceModule extends Module {
  constructor (db) {
    super(db)
    this.table = {
      place: new TablePlace()
    }
    this.index = {
      covering: new IndexCovering(),
      identity: new IndexIdentityUnique()
    }
    this.statement = {
      insert: new StatementInsert(),
      fetch: new StatementFetch()
    }
  }
  insert (place) {
    return this.statement.insert.run({
      source: place.identity.source,
      id: place.identity.id,
      class: place.ontology.class,
      type: place.ontology.type
    })
  }
}

module.exports = PlaceModule
