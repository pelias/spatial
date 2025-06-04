const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableShard = require('./TableShard')
const ShardGeoColumn = require('./ShardGeoColumn')
const ShardGeoIndex = require('./ShardGeoIndex')

tap.test('create & drop', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableShard()
  table.create(db)

  let introspectIndex = () => {
    return introspect.geometryColumns('shard')
      .filter(c => c.f_geometry_column === 'geom')
      .filter(c => c.spatial_index_enabled === 1)
  }

  // column does not exist
  t.notOk(introspectIndex().length, 'prior state')

  // create column
  let column = new ShardGeoColumn()
  column.create(db)

  // create index
  let index = new ShardGeoIndex()
  index.create(db)

  // column exists
  t.ok(introspectIndex().length, 'create')

  // drop index
  index.drop(db)

  // index should not exist
  // @todo: why is spatial_index_enabled still set to 1?
  // t.same(introspectIndex(), [], 'drop')

  t.end()
})
