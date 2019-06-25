const format = require('../../import/format')
const TableGeometry = require('./TableGeometry')
const GeoColumnGeom = require('./GeoColumnGeom')
const StatementInsert = require('./StatementInsert')

const TRIANGLE = format.from('geometry', 'geojson', {
  'type': 'MultiPolygon',
  'coordinates': [[[[1, 1], [2, 2], [3, 3], [1, 1]]]]
})

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempSpatialDatabase()

    // create table
    let table = new TableGeometry()
    table.create(db)

    // create geo column
    let column = new GeoColumnGeom()
    column.create(db)

    // prepare statement
    let stmt = new StatementInsert()
    stmt.create(db)

    // table empty
    t.false(db.prepare(`SELECT * FROM geometry`).all().length, 'prior state')

    // insert data
    let info = stmt.run({
      source: 'example_source',
      id: 'example_id',
      geom: TRIANGLE.toWkb()
    })

    // insert info
    t.deepEqual(info, { changes: 1, lastInsertRowid: 1 }, 'write')

    // read data
    t.deepEqual(db.prepare(`SELECT *, AsBinary(geom) AS geom FROM geometry`).all(), [{
      source: 'example_source',
      id: 'example_id',
      geom: TRIANGLE.toWkb()
    }], 'read')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`StatementInsert: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
