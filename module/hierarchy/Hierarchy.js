const Module = require('../Module')
const TableHierarchy = require('./TableHierarchy')
const IndexUnique = require('./IndexUnique')
const IndexChildIdentity = require('./IndexChildIdentity')
const IndexParentIdentity = require('./IndexParentIdentity')
const StatementInsert = require('./StatementInsert')
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
      insert: new StatementInsert()
    }
    this.trigger = {
      onInsert: new TriggerOnInsert()
    }
    this.view = {
      insertProxy: new ViewInsertProxy()
    }
  }
  insert () {
    // @todo
  }
}

module.exports = Hierarchy
