const Module = require('../Module')
const TableHierarchy = require('./TableHierarchy')
const IndexUnique = require('./IndexUnique')
const IndexChildIdentity = require('./IndexChildIdentity')
const IndexParentIdentity = require('./IndexParentIdentity')
const IndexPipPerformance = require('./IndexPipPerformance')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')
const ViewInsertProxy = require('./ViewInsertProxy')
const TriggerOnInsert = require('./TriggerOnInsert')

class HierarchyModule extends Module {
  constructor (db) {
    super(db)
    this.table = {
      hierarchy: new TableHierarchy()
    }
    this.index = {
      unique: new IndexUnique(),
      identityChild: new IndexChildIdentity(),
      identityParent: new IndexParentIdentity(),
      pipPerformance: new IndexPipPerformance()
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
  insert (place) {
    let info = { changes: 0, lastInsertRowid: 0 }
    place.hierarchy.forEach(hierarchy => {
      // insert hierarchy
      let _info = this.statement.insert.run({
        child_source: hierarchy.child.source,
        child_id: hierarchy.child.id,
        parent_source: hierarchy.parent.source,
        parent_id: hierarchy.parent.id,
        branch: hierarchy.branch
      })

      // update aggregate info
      info.changes += _info.changes
      info.lastInsertRowid = _info.lastInsertRowid
    })
    return info
  }
}

module.exports = HierarchyModule
