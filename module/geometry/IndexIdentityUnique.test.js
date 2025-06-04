const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableGeometry = require('./TableGeometry')
const IndexIdentityUnique = require('./IndexIdentityUnique')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableGeometry()
  table.create(db)

  // index does not exist
  t.notOk(introspect.indices('geometry').length, 'prior state')

  // create index
  let index = new IndexIdentityUnique()
  index.create(db)

  // index exists
  t.ok(introspect.indices('geometry').length, 'create')

  // drop index
  index.drop(db)

  // index does not exist
  t.notOk(introspect.indices('geometry').length, 'drop')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableGeometry()
  table.create(db)

  // create index
  let index = new IndexIdentityUnique()
  index.create(db)

  // test indices
  let indices = introspect.indices('geometry')

  // geometry_idx_unique
  t.same(indices[0], {
    seq: 0,
    name: 'geometry_idx_unique',
    unique: 1,
    origin: 'c',
    partial: 0
  }, 'geometry_idx_unique')

  t.end()
})
