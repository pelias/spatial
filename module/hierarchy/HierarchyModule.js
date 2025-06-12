const Module = require('../Module')
const TableHierarchy = require('./TableHierarchy')
const IndexUnique = require('./IndexUnique')
const IndexChildIdentity = require('./IndexChildIdentity')
const IndexParentIdentity = require('./IndexParentIdentity')
const IndexPipPerformance = require('./IndexPipPerformance')
const StatementInsertParent = require('./StatementInsertParent')
const StatementFetch = require('./StatementFetch')
const ViewInsertParent = require('./ViewInsertParent')
const TriggerOnInsertParent = require('./TriggerOnInsertParent')

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
      insertParent: new StatementInsertParent(),
      fetch: new StatementFetch()
    }
    this.trigger = {
      onInsertParent: new TriggerOnInsertParent()
    }
    this.view = {
      insertParent: new ViewInsertParent()
    }
  }
  insert (place) {
    let info = { changes: 0, lastInsertRowid: 0 }
    place.hierarchy.forEach(hierarchy => {
      // insert hierarchy
      let _info = this.statement.insertParent.run({
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
