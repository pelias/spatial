const tap = require('tap')
const common = require('../../test/common')
const TableHierarchy = require('./TableHierarchy')
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
    depth: 1,
    branch: 'default'
  })

  // insert info
  t.same(info, { changes: 1, lastInsertRowid: 1 }, 'write')

  // read data
  t.same(db.prepare(`SELECT * FROM hierarchy`).all(), [{
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
    depth: 1,
    branch: 'default'
  })
  stmt.run({
    parent_source: 'example_super_parent_source',
    parent_id: 'example_super_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    depth: 2,
    branch: 'default'
  })

  // read data
  t.same(db.prepare(`SELECT * FROM hierarchy`).all(), [{
    parent_source: 'example_parent_source',
    parent_id: 'example_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    depth: 1,
    branch: 'default'
  }, {
    parent_source: 'example_super_parent_source',
    parent_id: 'example_super_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    depth: 2,
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

  // prepare statement
  let stmt = new StatementInsert()
  stmt.create(db)

  // table empty
  t.notOk(db.prepare(`SELECT * FROM hierarchy`).all().length, 'prior state')

  // insert data
  stmt.run({
    parent_source: 'example_super_parent_source',
    parent_id: 'example_super_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    depth: 2,
    branch: 'default'
  })
  stmt.run({
    parent_source: 'example_parent_source',
    parent_id: 'example_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    depth: 1,
    branch: 'default'
  })

  // read data
  t.same(db.prepare(`SELECT * FROM hierarchy`).all(), [{
    parent_source: 'example_super_parent_source',
    parent_id: 'example_super_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    depth: 2,
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
