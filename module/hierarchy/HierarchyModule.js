const _ = require('lodash')
const Module = require('../Module')
const Hierarchy = require('../../model/Hierarchy')
const TableHierarchy = require('./TableHierarchy')
const IndexUnique = require('./IndexUnique')
const IndexChildIdentity = require('./IndexChildIdentity')
const IndexParentIdentity = require('./IndexParentIdentity')
const IndexPipPerformance = require('./IndexPipPerformance')
const StatementInsert = require('./StatementInsert')
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
      insert: new StatementInsert(),
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
      let args = {
        child_source: hierarchy.child.source,
        child_id: hierarchy.child.id,
        parent_source: hierarchy.parent.source,
        parent_id: hierarchy.parent.id,
        branch: hierarchy.branch
      }

      // we support two different hierarchy insertion methods
      // one where the depth is unknown and the parent hierarchy
      // is automatically generated, the second method is where
      // the depth is known. Each method uses a different query.

      // insert hierarchy, update aggregate info
      if (hierarchy.depth === Hierarchy.UNKNOWN_DEPTH) {
        _.extend(info, this.statement.insertParent.run(args))
      } else {
        _.extend(info, this.statement.insert.run({ ...args, depth: hierarchy.depth }))
      }
    })
    return info
  }
}

module.exports = HierarchyModule
