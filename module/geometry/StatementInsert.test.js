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

tap.test('query config', (t) => {
  const db = common.tempSpatialDatabase()
  new TableGeometry().create(db)
  new GeoColumnGeom().create(db)

  const stmts = {
    default: new StatementInsert(),
    simplify: new StatementInsert(),
    repair: new StatementInsert(),
    simplifyAndRepair: new StatementInsert()
  }

  // no config specified
  stmts.default.create(db)
  t.equal(stmts.default.statement.source, `
        INSERT OR REPLACE INTO main.geometry (
          source,
          id,
          role,
          geom
        ) VALUES (
          @source,
          @id,
          @role,
          GeomFromWKB( @geom, 4326 )
        )`)

  // repair only
  stmts.repair.create(db, { module: { geometry: { repair: 1 } } })
  t.equal(stmts.repair.statement.source, `
        INSERT OR REPLACE INTO main.geometry (
          source,
          id,
          role,
          geom
        ) VALUES (
          @source,
          @id,
          @role,
          MakeValid( GeomFromWKB( @geom, 4326 ) )
        )`)

  // simplify only
  stmts.simplify.create(db, { module: { geometry: { simplify: 0.001 } } })
  t.equal(stmts.simplify.statement.source, `
        INSERT OR REPLACE INTO main.geometry (
          source,
          id,
          role,
          geom
        ) VALUES (
          @source,
          @id,
          @role,
          SimplifyPreserveTopology( GeomFromWKB( @geom, 4326 ), 0.001 )
        )`)

  // simplify + repair
  stmts.simplifyAndRepair.create(db, { module: { geometry: { simplify: 0.001, repair: 2 } } })
  t.equal(stmts.simplifyAndRepair.statement.source, `
        INSERT OR REPLACE INTO main.geometry (
          source,
          id,
          role,
          geom
        ) VALUES (
          @source,
          @id,
          @role,
          SimplifyPreserveTopology( GeosMakeValid( GeomFromWKB( @geom, 4326 ) ), 0.001 )
        )`)

  t.end()
})
