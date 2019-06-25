const Module = require('../Module')
const TableDocument = require('./TableDocument')
const IndexCovering = require('./IndexCovering')
const IndexUnique = require('./IndexUnique')
const StatementInsert = require('./StatementInsert')

class Document extends Module {
  constructor (db) {
    super(db)
    this.table = {
      document: new TableDocument()
    }
    this.index = {
      covering: new IndexCovering(),
      unique: new IndexUnique()
    }
    this.statement = {
      insert: new StatementInsert()
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
