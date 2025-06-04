const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableShard = require('./TableShard')
const ShardGeoColumn = require('./ShardGeoColumn')

tap.test('create & drop', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableShard()
  table.create(db)

  // column does not exist
  t.notOk(introspect.geometryColumns('shard').filter(c => c.f_geometry_column === 'geom').length, 'prior state')

  // create column
  let column = new ShardGeoColumn()
  column.create(db)

  // column exists
  t.ok(introspect.geometryColumns('shard').filter(c => c.f_geometry_column === 'geom').length, 'create')

  // note: dropping geometry columns not fully supported by spatialite
  // drop column
  column.drop(db)

  // column does not exist
  // @todo test this functionality if possible
  // t.notOk(introspect.geometryColumns('shard').filter(c => c.f_geometry_column === 'geom').length, 'drop')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableShard()
  table.create(db)

  // create column
  let column = new ShardGeoColumn()
  column.create(db)

  // test indices
  let geom = introspect.columns('shard').filter(c => c.name === 'geom')

  // geom
  t.same(geom[0], {
    cid: 4,
    name: 'geom',
    type: 'POLYGON',
    notnull: 1,
    dflt_value: `''`,
    pk: 0
  }, 'geom')

  t.end()
})
