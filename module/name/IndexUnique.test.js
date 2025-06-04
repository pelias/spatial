const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableName = require('./TableName')
const IndexUnique = require('./IndexUnique')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableName()
  table.create(db)

  // index does not exist
  t.notOk(introspect.indices('name').length, 'prior state')

  // create index
  let index = new IndexUnique()
  index.create(db)

  // index exists
  t.ok(introspect.indices('name').length, 'create')

  // drop index
  index.drop(db)

  // index does not exist
  t.notOk(introspect.indices('name').length, 'drop')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableName()
  table.create(db)

  // create index
  let index = new IndexUnique()
  index.create(db)

  // test indices
  let indices = introspect.indices('name')

  // name_idx_unique
  t.same(indices[0], {
    seq: 0,
    name: 'name_idx_unique',
    unique: 1,
    origin: 'c',
    partial: 0
  }, 'name_idx_unique')

  t.end()
})
