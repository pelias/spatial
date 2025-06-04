const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableShardSubdivide = require('./TableShardSubdivide')
const SubdivideGeoColumn = require('./SubdivideGeoColumn')

tap.test('create & drop', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableShardSubdivide()
  table.create(db)

  // column does not exist
  t.notOk(introspect.geometryColumns('shard_subdivide').filter(c => c.f_geometry_column === 'geom').length, 'prior state')

  // create column
  let column = new SubdivideGeoColumn()
  column.create(db)

  // column exists
  t.ok(introspect.geometryColumns('shard_subdivide').filter(c => c.f_geometry_column === 'geom').length, 'create')

  // note: dropping geometry columns not fully supported by spatialite
  // drop column
  column.drop(db)

  // column does not exist
  // @todo test this functionality if possible
  // t.notOk(introspect.geometryColumns('shard_subdivide').filter(c => c.f_geometry_column === 'geom').length, 'drop')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableShardSubdivide()
  table.create(db)

  // create column
  let column = new SubdivideGeoColumn()
  column.create(db)

  // test indices
  let geom = introspect.columns('shard_subdivide').filter(c => c.name === 'geom')

  // geom
  t.same(geom[0], {
    cid: 1,
    name: 'geom',
    type: 'GEOMETRY',
    notnull: 1,
    dflt_value: `''`,
    pk: 0
  }, 'geom')

  t.end()
})
