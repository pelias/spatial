const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableShard = require('./TableShard')
const GeoColumnGeom = require('./GeoColumnGeom')
const GeoViewPointInPolygon = require('./GeoViewPointInPolygon')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempSpatialDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableShard()
    table.create(db)

    // create column
    let column = new GeoColumnGeom()
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
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`GeoViewPointInPolygon: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
