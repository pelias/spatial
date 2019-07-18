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
  insert (place) {
    let info = { changes: 0, lastInsertRowid: 0 }
    place.name.forEach(name => {
      // insert name
      let _info = this.statement.insert.run({
        source: place.identity.source,
        id: place.identity.id,
        lang: name.lang,
        tag: name.tag,
        abbr: name.abbr ? 1 : 0,
        name: name.name
      })

      // update aggregate info
      info.changes += _info.changes
      info.lastInsertRowid = _info.lastInsertRowid
    })
    return info
  }
}

module.exports = NameModule
