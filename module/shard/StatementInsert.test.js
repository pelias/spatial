const format = require('../../import/format')
const TableShard = require('./TableShard')
const GeoColumnGeom = require('./GeoColumnGeom')
const StatementInsert = require('./StatementInsert')
const TRIANGLE = format.from('geometry', 'geojson', require('../../test/fixture/geojson.triangle'))

module.exports.tests = {}

module.exports.tests.function = (test, common) => {
  test('function', (t) => {
    let db = common.tempSpatialDatabase()

    // create table
    let table = new TableShard()
    table.create(db)

    // create geo column
    let column = new GeoColumnGeom()
    column.create(db)

    // prepare statement
    let stmt = new StatementInsert()
    stmt.create(db)

    // table empty
    t.false(db.prepare(`SELECT * FROM shard`).all().length, 'prior state')

    // insert data
    let info = stmt.run({
      source: 'example_source',
      id: 'example_id',
      geom: TRIANGLE.toWkb()
    })

    // insert info
    t.deepEqual(info, { changes: 1, lastInsertRowid: 1 }, 'write')

    // read data
    t.deepEqual(db.prepare(`SELECT *, AsBinary(geom) AS geom FROM shard`).all(), [{
      source: 'example_source',
      id: 'example_id',
      path: '0',
      complexity: null,
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
