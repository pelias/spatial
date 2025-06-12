const tap = require('tap')
const common = require('../../test/common')
const TableHierarchy = require('./TableHierarchy')
const ViewInsertParent = require('./ViewInsertParent')
const TriggerOnInsertParent = require('./TriggerOnInsertParent')
const StatementInsertParent = require('./StatementInsertParent')
const IndexUnique = require('./IndexUnique')

tap.test('single insert', (t) => {
  let db = common.tempDatabase()

  // create table
  let table = new TableHierarchy()
  table.create(db)

  // create index
  let idx = new IndexUnique()
  idx.create(db)

  // create view
  let view = new ViewInsertParent()
  view.create(db)

  // create trigger
  let trigger = new TriggerOnInsertParent()
  trigger.create(db)

  // prepare statement
  let stmt = new StatementInsertParent()
  stmt.create(db)

  // table empty
  t.notOk(db.prepare(`SELECT * FROM hierarchy`).all().length, 'prior state')

  // insert data
  let info = stmt.run({
    parent_source: 'example_parent_source',
    parent_id: 'example_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    branch: 'default'
  })

  // insert info
  // note: info is not available due to using INSTEAD OF INSERT
  t.same(info, { changes: 0, lastInsertRowid: 0 }, 'write')

  // read data
  t.same(db.prepare(`SELECT * FROM hierarchy`).all(), [{
    parent_source: 'example_parent_source',
    parent_id: 'example_parent_id',
    child_source: 'example_parent_source',
    child_id: 'example_parent_id',
    depth: 0,
    branch: 'default'
  }, {
    parent_source: 'example_child_source',
    parent_id: 'example_child_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    depth: 0,
    branch: 'default'
  }, {
    parent_source: 'example_parent_source',
    parent_id: 'example_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    depth: 1,
    branch: 'default'
  }],
  'read')

  t.end()
})
tap.test('add parent', (t) => {
  let db = common.tempDatabase()

  // create table
  let table = new TableHierarchy()
  table.create(db)

  // create index
  let idx = new IndexUnique()
  idx.create(db)

  // create view
  let view = new ViewInsertParent()
  view.create(db)

  // create trigger
  let trigger = new TriggerOnInsertParent()
  trigger.create(db)

  // prepare statement
  let stmt = new StatementInsertParent()
  stmt.create(db)

  // table empty
  t.notOk(db.prepare(`SELECT * FROM hierarchy`).all().length, 'prior state')

  // insert data
  stmt.run({
    parent_source: 'example_parent_source',
    parent_id: 'example_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    branch: 'default'
  })
  stmt.run({
    parent_source: 'example_super_parent_source',
    parent_id: 'example_super_parent_id',
    child_source: 'example_parent_source',
    child_id: 'example_parent_id',
    branch: 'default'
  })

  // read data
  t.same(db.prepare(`SELECT * FROM hierarchy`).all(), [{
    parent_source: 'example_parent_source',
    parent_id: 'example_parent_id',
    child_source: 'example_parent_source',
    child_id: 'example_parent_id',
    depth: 0,
    branch: 'default'
  }, {
    parent_source: 'example_child_source',
    parent_id: 'example_child_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    depth: 0,
    branch: 'default'
  }, {
    parent_source: 'example_parent_source',
    parent_id: 'example_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    depth: 1,
    branch: 'default'
  }, {
    parent_source: 'example_super_parent_source',
    parent_id: 'example_super_parent_id',
    child_source: 'example_super_parent_source',
    child_id: 'example_super_parent_id',
    depth: 0,
    branch: 'default'
  }, {
    parent_source: 'example_super_parent_source',
    parent_id: 'example_super_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    depth: 2,
    branch: 'default'
  }, {
    parent_source: 'example_super_parent_source',
    parent_id: 'example_super_parent_id',
    child_source: 'example_parent_source',
    child_id: 'example_parent_id',
    depth: 1,
    branch: 'default'
  }],
  'read')

  t.end()
})
tap.test('add child', (t) => {
  let db = common.tempDatabase()

  // create table
  let table = new TableHierarchy()
  table.create(db)

  // create index
  let idx = new IndexUnique()
  idx.create(db)

  // create view
  let view = new ViewInsertParent()
  view.create(db)

  // create view
  let trigger = new TriggerOnInsertParent()
  trigger.create(db)

  // prepare statement
  let stmt = new StatementInsertParent()
  stmt.create(db)

  // table empty
  t.notOk(db.prepare(`SELECT * FROM hierarchy`).all().length, 'prior state')

  // insert data
  stmt.run({
    parent_source: 'example_parent_source',
    parent_id: 'example_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    branch: 'default'
  })
  stmt.run({
    parent_source: 'example_child_source',
    parent_id: 'example_child_id',
    child_source: 'example_super_child_source',
    child_id: 'example_super_child_id',
    branch: 'default'
  })

  // read data
  t.same(db.prepare(`SELECT * FROM hierarchy`).all(), [{
    parent_source: 'example_parent_source',
    parent_id: 'example_parent_id',
    child_source: 'example_parent_source',
    child_id: 'example_parent_id',
    depth: 0,
    branch: 'default'
  }, {
    parent_source: 'example_child_source',
    parent_id: 'example_child_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    depth: 0,
    branch: 'default'
  }, {
    parent_source: 'example_parent_source',
    parent_id: 'example_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    depth: 1,
    branch: 'default'
  }, {
    parent_source: 'example_super_child_source',
    parent_id: 'example_super_child_id',
    child_source: 'example_super_child_source',
    child_id: 'example_super_child_id',
    depth: 0,
    branch: 'default'
  }, {
    parent_source: 'example_child_source',
    parent_id: 'example_child_id',
    child_source: 'example_super_child_source',
    child_id: 'example_super_child_id',
    depth: 1,
    branch: 'default'
  }, {
    parent_source: 'example_parent_source',
    parent_id: 'example_parent_id',
    child_source: 'example_super_child_source',
    child_id: 'example_super_child_id',
    depth: 2,
    branch: 'default'
  }],
  'read')

  t.end()
})
