const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableProperty = require('./TableProperty')
const IndexUnique = require('./IndexUnique')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableProperty()
  table.create(db)

  // index does not exist
  t.notOk(introspect.indices('property').length, 'prior state')

  // create index
  let index = new IndexUnique()
  index.create(db)

  // index exists
  t.ok(introspect.indices('property').length, 'create')

  // drop index
  index.drop(db)

  // index does not exist
  t.notOk(introspect.indices('property').length, 'drop')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableProperty()
  table.create(db)

  // create index
  let index = new IndexUnique()
  index.create(db)

  // test indices
  let indices = introspect.indices('property')

  // property_idx_unique
  t.same(indices[0], {
    seq: 0,
    name: 'property_idx_unique',
    unique: 1,
    origin: 'c',
    partial: 0
  }, 'property_idx_unique')

  t.end()
})
