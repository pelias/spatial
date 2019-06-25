const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableGeometry = require('./TableGeometry')
const GeoColumnGeom = require('./GeoColumnGeom')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempSpatialDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableGeometry()
    table.create(db)

    // column does not exist
    t.false(introspect.geometryColumns('geometry').filter(c => c.f_geometry_column === 'geom').length, 'prior state')

    // create column
    let column = new GeoColumnGeom()
    column.create(db)

    // column exists
    t.true(introspect.geometryColumns('geometry').filter(c => c.f_geometry_column === 'geom').length, 'create')

    // note: dropping geometry columns not fully supported by spatialite
    // drop column
    column.drop(db)

    // column does not exist
    // @todo test this functionality if possible
    // t.false(introspect.geometryColumns('geometry').filter(c => c.f_geometry_column === 'geom').length, 'drop')

    t.end()
  })
}

module.exports.tests.definition = (test, common) => {
  test('definition', (t) => {
    let db = common.tempSpatialDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableGeometry()
    table.create(db)

    // create column
    let column = new GeoColumnGeom()
    column.create(db)

    // test indices
    let geom = introspect.columns('geometry').filter(c => c.name === 'geom')

    // geometry_idx_complexity
    t.deepEqual(geom[0], {
      cid: 2,
      name: 'geom',
      type: 'GEOMETRY',
      notnull: 1,
      dflt_value: `''`,
      pk: 0
    }, 'geom')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`GeoColumnGeom: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
