const Module = require('../Module')
const TableProperty = require('./TableProperty')
const IndexIdentity = require('./IndexIdentity')
const IndexUnique = require('./IndexUnique')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')

class PropertyModule extends Module {
  constructor (db) {
    super(db)
    this.table = {
      property: new TableProperty()
    }
    this.index = {
      identity: new IndexIdentity(),
      unique: new IndexUnique()
    }
    this.statement = {
      insert: new StatementInsert(),
      fetch: new StatementFetch()
    }
  }
  insert (place) {
    let info = { changes: 0, lastInsertRowid: 0 }
    place.property.forEach(property => {
      // insert property
      let _info = this.statement.insert.run({
        source: place.identity.source,
        id: place.identity.id,
        key: property.key,
        value: property.value
      })

      // update aggregate info
      info.changes += _info.changes
      info.lastInsertRowid = _info.lastInsertRowid
    })
    return info
  }
}

module.exports = PropertyModule
