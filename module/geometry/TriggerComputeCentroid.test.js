const tap = require('tap')
const common = require('../../test/common')
const format = require('../../import/format')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const GeometryModule = require('./GeometryModule')
const TableGeometry = require('./TableGeometry')
const GeoColumnGeom = require('./GeoColumnGeom')
const TriggerComputeCentroid = require('./TriggerComputeCentroid')
const POLYGON = format.from('geometry', 'geojson', require('../../test/fixture/geojson.singapore'))
const TOPO_ERROR = format.from('geometry', 'geojson', require('../../test/fixture/geojson.wof.1360665447'))

const filter = function (t) { return t.name === 'geometry_compute_centroid' }

tap.test('create & drop', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // set up geometry table
  let table = new TableGeometry()
  table.create(db)

  // set up geom column
  let column = new GeoColumnGeom()
  column.create(db)

  // trigger does not exist
  t.notOk(introspect.triggers('geometry').filter(filter).length, 'prior state')

  // create trigger
  let trigger = new TriggerComputeCentroid()
  trigger.create(db)

  // trigger exists
  t.ok(introspect.triggers('geometry').filter(filter).length, 'create')

  // drop trigger
  trigger.drop(db)

  // trigger does not exist
  t.notOk(introspect.triggers('geometry').filter(filter).length, 'drop')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // set up geometry module
  let mod = new GeometryModule(db)
  mod.setup()

  // test triggers
  let triggers = introspect.triggers('geometry').filter(filter)

  // geometry_compute_centroid
  t.same(triggers[0], {
    type: 'trigger',
    name: 'geometry_compute_centroid',
    tbl_name: 'geometry',
    rootpage: 0,
    sql: `
        CREATE TRIGGER IF NOT EXISTS geometry_compute_centroid
        AFTER INSERT ON main.geometry
        -- only polygon types supported
        WHEN GeometryType( NEW.geom ) IN ('POLYGON', 'MULTIPOLYGON')
        AND UPPER( NEW.role ) = 'BOUNDARY'
        BEGIN
          INSERT OR IGNORE INTO geometry ( source, id, role, geom )
          VALUES ( NEW.source, NEW.id, 'centroid', IFNULL(
            PointOnSurface( NEW.geom ),
            PointOnSurface( Buffer( NEW.geom, 0 ) )
          ));
        END
      `.trim().replace(' IF NOT EXISTS', '')
  }, 'geometry_compute_centroid')

  t.end()
})

tap.test('function', (t) => {
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
    role: 'boundary',
    geom: POLYGON.toWkb()
  })

  // trigger has generated a centroid geometry
  const query = db.prepare(`
      SELECT source, id, role, AsText(geom) as geom
      FROM geometry
      WHERE role = 'centroid'
    `)
  t.same(query.all(), [
    {
      source: 'example_source',
      id: 'example_id',
      role: 'centroid',
      geom: 'POINT(103.825964 1.3653959)'
    }
  ], 'centroid')

  t.end()
})

/**
 * This $TOPO_ERROR geometry emits the following error:
 * GEOS error: TopologyException: Input geom 1 is invalid: Self-intersection at or near point -122.21479833403446 38.179404883659792 at -122.21479833403446 38.179404883659792
 *
 * Normally this will result in a failure to produce a valid centroid.
 * This test is to cover that scenario and ensure a valid centroid is still being produced.
 */
tap.test('geometry with errors', (t) => {
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
    role: 'boundary',
    geom: TOPO_ERROR.toWkb()
  })

  // trigger has generated a centroid geometry
  const query = db.prepare(`
      SELECT source, id, role, AsText(geom) as geom
      FROM geometry
      WHERE role = 'centroid'
    `)
  t.same(query.all(), [
    {
      source: 'example_source',
      id: 'example_id',
      role: 'centroid',
      geom: 'POINT(-122.6787419 38.448015)'
    }
  ], 'centroid')

  t.end()
})
