const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const GeometryModule = require('../geometry/GeometryModule')
const ShardModule = require('./ShardModule')

tap.test('create & drop', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // table does not exist
  t.notOk(introspect.tables().includes('shard_subdivide'), 'prior state')

  // set up geometry module
  let geometry = new GeometryModule(db)
  geometry.setup()

  // set up shard module
  let shard = new ShardModule(db)
  shard.setup()

  // table exists
  t.ok(introspect.tables().includes('shard_subdivide'), 'create')

  // drop table
  shard.table.subdivide.drop(db)

  // table does not exist
  t.notOk(introspect.tables().includes('shard_subdivide'), 'drop')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // set up geometry module
  let geometry = new GeometryModule(db)
  geometry.setup()

  // set up shard module
  let shard = new ShardModule(db)
  shard.setup()

  // test columns
  let columns = introspect.columns('shard_subdivide')

  // nullfield
  // @todo: can we simply remove this column?
  // it seems sqlite doesn't support columnless tables..
  t.same(columns[0], {
    cid: 0,
    name: 'nullfield',
    type: 'INTEGER',
    notnull: 0,
    dflt_value: null,
    pk: 0
  }, 'nullfield')

  t.end()
})
