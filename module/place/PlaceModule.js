const Module = require('../Module')
const TablePlace = require('./TablePlace')
const IndexOntology = require('./IndexOntology')
const IndexIdentityUnique = require('./IndexIdentityUnique')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')
const StatementOntology = require('./StatementOntology')
const StatementOntologyIndex = require('./StatementOntologyIndex')

class PlaceModule extends Module {
  constructor (db) {
    super(db)
    this.table = {
      place: new TablePlace()
    }
    this.index = {
      identity: new IndexIdentityUnique(),
      ontology: new IndexOntology()
    }
    this.statement = {
      insert: new StatementInsert(),
      fetch: new StatementFetch(),
      ontology: new StatementOntology(),
      ontologyIndex: new StatementOntologyIndex()
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
