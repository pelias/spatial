const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const GeometryModule = require('./GeometryModule')

tap.test('create & drop', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // table does not exist
  t.notOk(introspect.tables().includes('geometry'), 'prior state')

  // setup module
  let module = new GeometryModule(db)
  module.setup()

  // table exists
  t.ok(introspect.tables().includes('geometry'), 'create')

  // drop table
  module.table.geometry.drop(db)

  // table does not exist
  t.notOk(introspect.tables().includes('geometry'), 'drop')

  t.end()
})

tap.test('merge', (t) => {
  let external = common.tempSpatialDatabase({ memory: false })

  // setup module
  let mod = new GeometryModule(external)
  mod.setup()

  // ensure table is empty
  t.equal(external.prepare(`SELECT * FROM geometry`).all().length, 0, 'prior state')

  // insert some data
  let stmt = external.prepare(`
      INSERT INTO geometry (source, id, role, geom)
      VALUES (@source, @id, @role, MakePoint( @lon, @lat, 4326 ))
    `)

  stmt.run({ source: 'example', id: 'id1', role: 'default', lat: 1, lon: 1 })
  stmt.run({ source: 'example', id: 'id2', role: 'default', lat: 2, lon: 2 })
  stmt.run({ source: 'example', id: 'id3', role: 'default', lat: 3, lon: 3 })

  // ensure table is populated
  t.equal(external.prepare(`SELECT * FROM geometry`).all().length, 3, 'write')

  // close external database
  external.close()

  // ---

  // generate second database
  let db = common.tempSpatialDatabase()

  // setup module on second db
  mod = new GeometryModule(db)
  mod.setup()

  // attach external database
  db.prepare(`ATTACH DATABASE '${external.name}' as 'external'`).run()

  // ensure external table is populated
  t.equal(db.prepare(`SELECT * FROM external.geometry`).all().length, 3, 'external state')

  // table does not exist
  mod.table.geometry.merge(db, 'external', 'main')

  // ensure table is merged to main db
  t.equal(db.prepare(`SELECT * FROM geometry`).all().length, 3, 'merged')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // setup module
  let module = new GeometryModule(db)
  module.setup()

  // test columns
  let columns = introspect.columns('geometry')

  // source
  t.same(columns[0], {
    cid: 0,
    name: 'source',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'source')

  // id
  t.same(columns[1], {
    cid: 1,
    name: 'id',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'id')

  // role
  t.same(columns[2], {
    cid: 2,
    name: 'role',
    type: 'TEXT',
    notnull: 1,
    dflt_value: `'default'`,
    pk: 0
  }, 'role')

  t.end()
})
