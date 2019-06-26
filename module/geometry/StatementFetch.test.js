const format = require('../../import/format')
const TableGeometry = require('./TableGeometry')
const GeoColumnGeom = require('./GeoColumnGeom')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')

const TRIANGLE = format.from('geometry', 'geojson', {
  'type': 'MultiPolygon',
  'coordinates': [[[[1, 1], [2, 2], [3, 3], [1, 1]]]]
})

module.exports.tests = {}

module.exports.tests.function = (test, common) => {
  test('function', (t) => {
    let db = common.tempSpatialDatabase()

    // create table
    let table = new TableGeometry()
    table.create(db)

    // create geo column
    let column = new GeoColumnGeom()
    column.create(db)

    // prepare statements
    let insert = new StatementInsert()
    insert.create(db)

    let fetch = new StatementFetch()
    fetch.create(db)

    // table empty
    t.false(db.prepare(`SELECT * FROM geometry`).all().length, 'prior state')

    // insert data
    insert.run({
      source: 'example_source',
      id: 'example_id',
      role: 'example',
      geom: TRIANGLE.toWkb()
    })

    // ensure data written
    t.equal(db.prepare(`SELECT * FROM geometry`).all().length, 1, 'write')

    // read data
    let rows = fetch.all({
      source: 'example_source',
      id: 'example_id',
      limit: 1
    })

    // test response structure
    t.deepEqual(rows, [{
      source: 'example_source',
      id: 'example_id',
      role: 'example',
      geom: TRIANGLE.toWkb()
    }], 'read')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`StatementFetch: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
