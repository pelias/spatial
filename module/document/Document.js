const Module = require('../Module')
const TableDocument = require('./TableDocument')
const IndexCovering = require('./IndexCovering')
const IndexIdentityUnique = require('./IndexIdentityUnique')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')

class Document extends Module {
  constructor (db) {
    super(db)
    this.table = {
      document: new TableDocument()
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
  insert (doc) {
    return this.statement.insert.run({
      source: doc.source.toString(),
      id: doc.source_id.toString(),
      class: doc.class.toString(),
      type: doc.type.toString()
    })
  }
}

module.exports = Document
