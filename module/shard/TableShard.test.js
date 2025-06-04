const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const GeometryModule = require('../geometry/GeometryModule')
const ShardModule = require('./ShardModule')

tap.test('create & drop', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // table does not exist
  t.notOk(introspect.tables().includes('shard'), 'prior state')

  // set up geometry module
  let geometry = new GeometryModule(db)
  geometry.setup()

  // set up shard module
  let shard = new ShardModule(db)
  shard.setup()

  // table exists
  t.ok(introspect.tables().includes('shard'), 'create')

  // drop table
  shard.table.shard.drop(db)

  // table does not exist
  t.notOk(introspect.tables().includes('shard'), 'drop')

  t.end()
})

tap.test('merge', (t) => {
  let external = common.tempSpatialDatabase({ memory: false })

  // set up geometry module
  let geometry = new GeometryModule(external)
  geometry.setup()

  // set up shard module
  let shard = new ShardModule(external)
  shard.setup()

  // ensure table is empty
  t.equal(external.prepare(`SELECT * FROM shard`).all().length, 0, 'prior state')

  // insert some data
  let stmt = external.prepare(`
      INSERT INTO shard (source, id, role, element, geom)
      VALUES (@source, @id, @role, @element, Buffer( MakePoint( @lon, @lat, 4326 ), 1 ) )
    `)

  stmt.run({ source: 'example', id: 'id1', role: 'default', element: 1, lat: 1, lon: 1 })
  stmt.run({ source: 'example', id: 'id2', role: 'default', element: 1, lat: 2, lon: 2 })
  stmt.run({ source: 'example', id: 'id3', role: 'default', element: 1, lat: 3, lon: 3 })

  // ensure table is populated
  t.equal(external.prepare(`SELECT * FROM shard`).all().length, 3, 'write')

  // close external database
  external.close()

  // ---

  // generate second database
  let db = common.tempSpatialDatabase()

  // set up geometry module
  geometry = new GeometryModule(db)
  geometry.setup()

  // set up shard module
  shard = new ShardModule(db)
  shard.setup()

  // attach external database
  db.prepare(`ATTACH DATABASE '${external.name}' as 'external'`).run()

  // ensure external table is populated
  t.equal(db.prepare(`SELECT * FROM external.shard`).all().length, 3, 'external state')

  // table does not exist
  shard.table.shard.merge(db, 'external', 'main')

  // ensure table is merged to main db
  t.equal(db.prepare(`SELECT * FROM shard`).all().length, 3, 'merged')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // set up geometry module
  let geometry = new GeometryModule(db)
  geometry.setup()

  // set up shard module
  let shard = new ShardModule(db)
  shard.setup()

  // test columns
  let columns = introspect.columns('shard')

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

  // element
  t.same(columns[3], {
    cid: 3,
    name: 'element',
    type: 'INTEGER',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'element')

  t.end()
})
