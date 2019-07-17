const Module = require('../Module')
const TableName = require('./TableName')
const IndexIdentity = require('./IndexIdentity')
const IndexUnique = require('./IndexUnique')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')
const StatementSearch = require('./StatementSearch')

class NameModule extends Module {
  constructor (db) {
    super(db)
    this.table = {
      name: new TableName()
    }
    this.index = {
      identity: new IndexIdentity(),
      unique: new IndexUnique()
    }
    this.statement = {
      insert: new StatementInsert(),
      fetch: new StatementFetch(),
      search: new StatementSearch()
    }
  }
  insert (doc) {
    let info = { changes: 0, lastInsertRowid: 0 }
    if (Array.isArray(doc.name)) {
      doc.name.forEach(row => {
        // insert names
        let _info = this.statement.insert.run({
          source: doc.source.toString(),
          id: doc.source_id.toString(),
          lang: row.lang.toString().toLowerCase().substring(0, 3),
          tag: (row.tag || '').toString().toLowerCase().substring(0, 16),
          abbr: (row.abbr === 1 || row.abbr === true) ? 1 : 0,
          name: (row.name || '').trim()
        })

        // update aggregate info
        info.changes += _info.changes
        info.lastInsertRowid = _info.lastInsertRowid
      })
    }
    return info
  }
}

module.exports = NameModule
