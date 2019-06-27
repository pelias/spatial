const Module = require('../Module')
const TableHierarchy = require('./TableHierarchy')
const IndexUnique = require('./IndexUnique')
const IndexChildIdentity = require('./IndexChildIdentity')
const IndexParentIdentity = require('./IndexParentIdentity')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')
const ViewInsertProxy = require('./ViewInsertProxy')
const TriggerOnInsert = require('./TriggerOnInsert')

class Hierarchy extends Module {
  constructor (db) {
    super(db)
    this.table = {
      document: new TableHierarchy()
    }
    this.index = {
      unique: new IndexUnique(),
      identityChild: new IndexChildIdentity(),
      identityParent: new IndexParentIdentity()
    }
    this.statement = {
      insert: new StatementInsert(),
      fetch: new StatementFetch()
    }
    this.trigger = {
      onInsert: new TriggerOnInsert()
    }
    this.view = {
      insertProxy: new ViewInsertProxy()
    }
  }
  insert (doc) {
    let info = { changes: 0, lastInsertRowid: 0 }
    if (doc.hierarchy) {
      doc.hierarchy.forEach(relation => {
        // insert property
        let _info = this.statement.insert.run(relation)

        // update aggregate info
        info.changes += _info.changes
        info.lastInsertRowid = _info.lastInsertRowid
      })
    }
    return info
  }
}

module.exports = Hierarchy
