const tap = require('tap')
const common = require('../../test/common')
const format = require('../../import/format')
const TableGeometry = require('./TableGeometry')
const GeoColumnGeom = require('./GeoColumnGeom')
const StatementInsert = require('./StatementInsert')

const TRIANGLE = format.from('polygon', 'geojson', require('../../test/fixture/geojson.triangle'))

tap.test('create & drop', (t) => {
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
  t.notOk(db.prepare(`SELECT * FROM geometry`).all().length, 'prior state')

  // insert data
  let info = stmt.run({
    source: 'example_source',
    id: 'example_id',
    role: 'example',
    geom: TRIANGLE.toWkb()
  })

  // insert info
  t.same(info, { changes: 1, lastInsertRowid: 1 }, 'write')

  // read data
  t.same(db.prepare(`SELECT *, AsBinary(geom) AS geom FROM geometry`).all(), [{
    source: 'example_source',
    id: 'example_id',
    role: 'example',
    geom: TRIANGLE.toWkb()
  }], 'read')

  t.end()
})
