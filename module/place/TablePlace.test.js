const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const PlaceModule = require('./PlaceModule')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // table does not exist
  t.notOk(introspect.tables().includes('place'), 'prior state')

  // setup module
  let mod = new PlaceModule(db)
  mod.setup()

  // table exists
  t.ok(introspect.tables().includes('place'), 'create')

  // drop table
  mod.table.place.drop(db)

  // table does not exist
  t.notOk(introspect.tables().includes('place'), 'drop')

  t.end()
})

tap.test('merge', (t) => {
  let external = common.tempDatabase({ memory: false })

  // setup module
  let mod = new PlaceModule(external)
  mod.setup()

  // ensure table is empty
  t.equal(external.prepare(`SELECT * FROM place`).all().length, 0, 'prior state')

  // insert some data
  let stmt = external.prepare(`
      INSERT INTO place (source, id, class, type)
      VALUES (@source, @id, @class, @type)
    `)

  stmt.run({
    source: 'example',
    id: 'id1',
    class: 'admin',
    type: 'test'
  })
  stmt.run({
    source: 'example',
    id: 'id2',
    class: 'admin',
    type: 'test'
  })
  stmt.run({
    source: 'example',
    id: 'id3',
    class: 'admin',
    type: 'test'
  })

  // ensure table is populated
  t.equal(external.prepare(`SELECT * FROM place`).all().length, 3, 'write')

  // close external database
  external.close()

  // ---

  // generate second database
  let db = common.tempDatabase()

  // setup module on second db
  mod = new PlaceModule(db)
  mod.setup()

  // attach external database
  db.prepare(`ATTACH DATABASE '${external.name}' as 'external'`).run()

  // ensure external table is populated
  t.equal(db.prepare(`SELECT * FROM external.place`).all().length, 3, 'external state')

  // table does not exist
  mod.table.place.merge(db, 'external', 'main')

  // ensure table is merged to main db
  t.equal(db.prepare(`SELECT * FROM place`).all().length, 3, 'merged')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // setup module
  let mod = new PlaceModule(db)
  mod.setup()

  // test columns
  let columns = introspect.columns('place')

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

  // class
  t.same(columns[2], {
    cid: 2,
    name: 'class',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'class')

  // type
  t.same(columns[3], {
    cid: 3,
    name: 'type',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'type')

  t.end()
})
