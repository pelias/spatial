const tap = require('tap')
const common = require('../../test/common')
const TableHierarchy = require('./TableHierarchy')
const IndexUnique = require('./IndexUnique')
const ViewInsertProxy = require('./ViewInsertProxy')
const TriggerOnInsert = require('./TriggerOnInsert')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')

tap.test('function', (t) => {
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
  let insert = new StatementInsert()
  insert.create(db)

  // prepare statement
  let fetch = new StatementFetch()
  fetch.create(db)

  // table empty
  t.false(db.prepare(`SELECT * FROM hierarchy`).all().length, 'prior state')

  // insert data
  insert.run({
    parent_source: 'example_parent_source',
    parent_id: 'example_parent_id',
    child_source: 'example_child_source',
    child_id: 'example_child_id',
    branch: 'default'
  })

  // ensure data written
  t.equal(db.prepare(`SELECT * FROM hierarchy`).all().length, 3, 'write')

  // read data
  let rows = fetch.all({
    source: 'example_child_source',
    id: 'example_child_id',
    limit: 3
  })

  // test response structure
  t.deepEqual(rows, [{
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
