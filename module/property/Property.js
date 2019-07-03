const _ = require('lodash')
const Module = require('../Module')
const TableProperty = require('./TableProperty')
const IndexIdentity = require('./IndexIdentity')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')

class Property extends Module {
  constructor (db) {
    super(db)
    this.table = {
      property: new TableProperty()
    }
    this.index = {
      identity: new IndexIdentity()
    }
    this.statement = {
      insert: new StatementInsert(),
      fetch: new StatementFetch()
    }
  }
  insert (doc) {
    let info = { changes: 0, lastInsertRowid: 0 }
    if (doc.property) {
      for (let key in doc.property) {
        // validate/normalize value
        let value = doc.property[key]
        if (!_.isString(value)) { continue }
        value = value.trim() // trim value
        if (!value.length) { continue }

        // insert property
        let _info = this.statement.insert.run({
          source: doc.source.toString(),
          id: doc.source_id.toString(),
          key: key.toString(),
          value: value
        })

        // update aggregate info
        info.changes += _info.changes
        info.lastInsertRowid = _info.lastInsertRowid
      }
    }
    return info
  }
}

module.exports = Property
