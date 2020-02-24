const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableShard = require('./TableShard')
const ShardGeoColumn = require('./ShardGeoColumn')
const GeoViewPointInPolygon = require('./GeoViewPointInPolygon')

tap.test('create & drop', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableShard()
  table.create(db)

  // create column
  let column = new ShardGeoColumn()
  column.create(db)

  // column does not exist
  t.false(introspect.views('point_in_polygon').length, 'prior state')
  t.false(db.prepare(`SELECT COUNT(*) AS cnt FROM views_geometry_columns`).get().cnt, 'prior state')

  // create index
  let index = new GeoViewPointInPolygon()
  index.create(db)

  // column exists
  t.true(introspect.views('point_in_polygon').length, 'create')
  t.true(db.prepare(`SELECT COUNT(*) AS cnt FROM views_geometry_columns`).get().cnt, 'create')

  // drop index
  index.drop(db)

  // column does not exist
  t.false(introspect.views('point_in_polygon').length, 'drop')
  t.false(db.prepare(`SELECT COUNT(*) AS cnt FROM views_geometry_columns`).get().cnt, 'drop')

  t.end()
})
