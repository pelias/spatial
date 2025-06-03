const tap = require('tap')
const common = require('../../test/common')
const TableHierarchy = require('./TableHierarchy')
const ViewInsertProxy = require('./ViewInsertProxy')
const TriggerOnInsert = require('./TriggerOnInsert')
const StatementInsert = require('./StatementInsert')
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
  let view = new ViewInsertProxy()
  view.create(db)

  // create trigger
  let trigger = new TriggerOnInsert()
  trigger.create(db)

  // prepare statement
  let stmt = new StatementInsert()
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
  t.deepEqual(info, { changes: 0, lastInsertRowid: 0 }, 'write')

  // read data
  t.deepEqual(db.prepare(`SELECT * FROM hierarchy`).all(), [{
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
  let view = new ViewInsertProxy()
  view.create(db)

  // create trigger
  let trigger = new TriggerOnInsert()
  trigger.create(db)

  // prepare statement
  let stmt = new StatementInsert()
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
  t.deepEqual(db.prepare(`SELECT * FROM hierarchy`).all(), [{
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
  let view = new ViewInsertProxy()
  view.create(db)

  // create view
  let trigger = new TriggerOnInsert()
  trigger.create(db)

  // prepare statement
  let stmt = new StatementInsert()
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
  t.deepEqual(db.prepare(`SELECT * FROM hierarchy`).all(), [{
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
