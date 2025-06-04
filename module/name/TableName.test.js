const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const NameModule = require('./NameModule')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // table does not exist
  t.notOk(introspect.tables().includes('name'), 'prior state')

  // setup module
  let mod = new NameModule(db)
  mod.setup()

  // table exists
  t.ok(introspect.tables().includes('name'), 'create')

  // drop table
  mod.table.name.drop(db)

  // table does not exist
  t.notOk(introspect.tables().includes('name'), 'drop')

  t.end()
})

tap.test('merge', (t) => {
  let external = common.tempDatabase({ memory: false })

  // setup module
  let mod = new NameModule(external)
  mod.setup()

  // ensure table is empty
  t.equal(external.prepare(`SELECT * FROM name`).all().length, 0, 'prior state')

  // insert some data
  let stmt = external.prepare(`
      INSERT INTO name (source, id, lang, tag, abbr, name)
      VALUES (@source, @id, @lang, @tag, @abbr, @name)
    `)

  stmt.run({
    source: 'example',
    id: 'id1',
    lang: 'eng',
    tag: '',
    abbr: 0,
    name: 'name1'
  })
  stmt.run({
    source: 'example',
    id: 'id1',
    lang: 'deu',
    tag: '',
    abbr: 0,
    name: 'name2'
  })
  stmt.run({
    source: 'example',
    id: 'id2',
    lang: 'eng',
    tag: '',
    abbr: 0,
    name: 'name3'
  })

  // ensure table is populated
  t.equal(external.prepare(`SELECT * FROM name`).all().length, 3, 'write')

  // close external database
  external.close()

  // ---

  // generate second database
  let db = common.tempDatabase()

  // setup module on second db
  mod = new NameModule(db)
  mod.setup()

  // attach external database
  db.prepare(`ATTACH DATABASE '${external.name}' as 'external'`).run()

  // ensure external table is populated
  t.equal(db.prepare(`SELECT * FROM external.name`).all().length, 3, 'external state')

  // table does not exist
  mod.table.name.merge(db, 'external', 'main')

  // ensure table is merged to main db
  t.equal(db.prepare(`SELECT * FROM name`).all().length, 3, 'merged')

  t.end()
})

// source TEXT NOT NULL,
// id TEXT NOT NULL,
// lang TEXT NOT NULL COLLATE NOCASE,
// sub TEXT NOT NULL COLLATE NOCASE,
// type TEXT NOT NULL COLLATE NOCASE,
// abbr INTEGER NOT NULL,
// name TEXT NOT NULL COLLATE NOCASE

tap.test('definition', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // setup module
  let mod = new NameModule(db)
  mod.setup()

  // test columns
  let columns = introspect.columns('name')

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

  // lang
  t.same(columns[2], {
    cid: 2,
    name: 'lang',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'lang')

  // tag
  t.same(columns[3], {
    cid: 3,
    name: 'tag',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'tag')

  // abbr
  t.same(columns[4], {
    cid: 4,
    name: 'abbr',
    type: 'INTEGER',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'abbr')

  // name
  t.same(columns[5], {
    cid: 5,
    name: 'name',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'name')

  t.end()
})
