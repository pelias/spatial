const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableHierarchy = require('./TableHierarchy')
const IndexPipPerformance = require('./IndexPipPerformance')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableHierarchy()
  table.create(db)

  // index does not exist
  t.notOk(introspect.indices('hierarchy').length, 'prior state')

  // create index
  let index = new IndexPipPerformance()
  index.create(db)

  // index exists
  t.ok(introspect.indices('hierarchy').length, 'create')

  // drop index
  index.drop(db)

  // index does not exist
  t.notOk(introspect.indices('hierarchy').length, 'drop')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableHierarchy()
  table.create(db)

  // create index
  let index = new IndexPipPerformance()
  index.create(db)

  // test indices
  let indices = introspect.indices('hierarchy')

  // hierarchy_idx_pip_performance
  t.same(indices[0], {
    seq: 0,
    name: 'hierarchy_idx_pip_performance',
    unique: 0,
    origin: 'c',
    partial: 0
  }, 'hierarchy_idx_pip_performance')

  t.end()
})
