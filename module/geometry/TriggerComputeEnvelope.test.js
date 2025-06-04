const tap = require('tap')
const common = require('../../test/common')
const format = require('../../import/format')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const GeometryModule = require('./GeometryModule')
const TableGeometry = require('./TableGeometry')
const GeoColumnGeom = require('./GeoColumnGeom')
const TriggerComputeEnvelope = require('./TriggerComputeEnvelope')
const POLYGON = format.from('geometry', 'geojson', require('../../test/fixture/geojson.singapore'))

const filter = function (t) { return t.name === 'geometry_compute_envelope' }

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
  let trigger = new TriggerComputeEnvelope()
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

  // geometry_compute_envelope
  t.same(triggers[0], {
    type: 'trigger',
    name: 'geometry_compute_envelope',
    tbl_name: 'geometry',
    rootpage: 0,
    sql: `
        CREATE TRIGGER IF NOT EXISTS geometry_compute_envelope
        AFTER INSERT ON main.geometry
        -- only polygon types supported
        WHEN GeometryType( NEW.geom ) IN ('POLYGON', 'MULTIPOLYGON')
        AND UPPER( NEW.role ) = 'BOUNDARY'
        BEGIN
          INSERT OR IGNORE INTO geometry ( source, id, role, geom )
          VALUES ( NEW.source, NEW.id, 'envelope', Envelope( NEW.geom ) );
        END
      `.trim().replace(' IF NOT EXISTS', '')
  }, 'geometry_compute_envelope')

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

  // trigger has generated a envelope geometry
  const query = db.prepare(`
      SELECT source, id, role, AsText(geom) as geom
      FROM geometry
      WHERE role = 'envelope'
    `)
  t.same(query.all(), [
    {
      source: 'example_source',
      id: 'example_id',
      role: 'envelope',
      geom: 'POLYGON((103.6358366 1.1539654, 104.4067842 1.1539654, 104.4067842 1.4703098, 103.6358366 1.4703098, 103.6358366 1.1539654))'
    }
  ], 'envelope')

  t.end()
})
