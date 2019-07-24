const format = require('../../import/format')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const GeometryModule = require('./GeometryModule')
const TableGeometry = require('./TableGeometry')
const GeoColumnGeom = require('./GeoColumnGeom')
const TriggerComputeCentroid = require('./TriggerComputeCentroid')
const POLYGON = format.from('geometry', 'geojson', require('../../test/fixture/geojson.singapore'))

module.exports.tests = {}

const filter = function (t) { return t.name === 'geometry_compute_centroid' }

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempSpatialDatabase()
    let introspect = new SqliteIntrospect(db)

    // set up geometry table
    let table = new TableGeometry()
    table.create(db)

    // set up geom column
    let column = new GeoColumnGeom()
    column.create(db)

    // trigger does not exist
    t.false(introspect.triggers('geometry').filter(filter).length, 'prior state')

    // create trigger
    let trigger = new TriggerComputeCentroid()
    trigger.create(db)

    // trigger exists
    t.true(introspect.triggers('geometry').filter(filter).length, 'create')

    // drop trigger
    trigger.drop(db)

    // trigger does not exist
    t.false(introspect.triggers('geometry').filter(filter).length, 'drop')

    t.end()
  })
}

module.exports.tests.definition = (test, common) => {
  test('definition', (t) => {
    let db = common.tempSpatialDatabase()
    let introspect = new SqliteIntrospect(db)

    // set up geometry module
    let mod = new GeometryModule(db)
    mod.setup()

    // test triggers
    let triggers = introspect.triggers('geometry').filter(filter)

    // geometry_compute_centroid
    t.deepEqual(triggers[0], {
      type: 'trigger',
      name: 'geometry_compute_centroid',
      tbl_name: 'geometry',
      rootpage: 0,
      sql: `
        CREATE TRIGGER IF NOT EXISTS geometry_compute_centroid
        AFTER INSERT ON main.geometry
        -- only polygon types supported
        WHEN GeometryType( NEW.geom ) LIKE '%POLYGON'
        BEGIN
          INSERT OR IGNORE INTO geometry ( source, id, role, geom )
          VALUES ( NEW.source, NEW.id, 'centroid', PointOnSurface( NEW.geom ) );
        END
      `.trim().replace(' IF NOT EXISTS', '')
    }, 'geometry_compute_centroid')

    t.end()
  })
}

module.exports.tests.function = (test, common) => {
  test('function', (t) => {
    let db = common.tempSpatialDatabase()

    // set up geometry module
    let geometry = new GeometryModule(db)
    geometry.setup()

    // table empty
    t.equal(db.prepare(`SELECT COUNT(*) AS cnt FROM geometry`).get().cnt, 0, 'prior state')

    // insert data in to geomeetry column (which fires the triggeer)
    geometry.statement.insert.run({
      source: 'example_source',
      id: 'example_id',
      role: 'default',
      geom: POLYGON.toWkb()
    })

    // trigger has generated a centroid geometry
    const query = db.prepare(`
      SELECT source, id, role, AsText(geom) as geom
      FROM geometry
      WHERE role = 'centroid'
    `)
    t.deepEqual(query.all(), [
      {
        source: 'example_source',
        id: 'example_id',
        role: 'centroid',
        geom: 'POINT(103.825964 1.3653959)'
      }
    ], 'centroid')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`TriggerComputeCentroid: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
