const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableGeometry = require('./TableGeometry')
const GeoColumnGeom = require('./GeoColumnGeom')
const IndexGeometryType = require('./IndexGeometryType')

tap.test('create & drop', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableGeometry()
  table.create(db)

  // create geo column
  let column = new GeoColumnGeom()
  column.create(db)

  // index does not exist
  t.notOk(introspect.indices('geometry').length, 'prior state')

  // create index
  let index = new IndexGeometryType()
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
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableGeometry()
  table.create(db)

  // create geo column
  let column = new GeoColumnGeom()
  column.create(db)

  // create index
  let index = new IndexGeometryType()
  index.create(db)

  // test indices
  let indices = introspect.indices('geometry')

  // geometry_idx_geom_type
  t.same(indices[0], {
    seq: 0,
    name: 'geometry_idx_geom_type',
    unique: 0,
    origin: 'c',
    partial: 0
  }, 'geometry_idx_geom_type')

  t.end()
})
