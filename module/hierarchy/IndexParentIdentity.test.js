const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableHierarchy = require('./TableHierarchy')
const IndexParentIdentity = require('./IndexParentIdentity')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableHierarchy()
  table.create(db)

  // index does not exist
  t.notOk(introspect.indices('hierarchy').length, 'prior state')

  // create index
  let index = new IndexParentIdentity()
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
  let index = new IndexParentIdentity()
  index.create(db)

  // test indices
  let indices = introspect.indices('hierarchy')

  // hierarchy_idx_parent_identity
  t.deepEqual(indices[0], {
    seq: 0,
    name: 'hierarchy_idx_parent_identity',
    unique: 0,
    origin: 'c',
    partial: 0
  }, 'hierarchy_idx_parent_identity')

  t.end()
})
