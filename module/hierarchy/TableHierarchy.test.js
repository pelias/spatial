const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const HierarchyModule = require('./HierarchyModule')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // table does not exist
  t.notOk(introspect.tables().includes('hierarchy'), 'prior state')

  // setup module
  let mod = new HierarchyModule(db)
  mod.setup()

  // table exists
  t.ok(introspect.tables().includes('hierarchy'), 'create')

  // drop table
  mod.table.hierarchy.drop(db)

  // table does not exist
  t.notOk(introspect.tables().includes('hierarchy'), 'drop')

  t.end()
})

tap.test('merge', (t) => {
  let external = common.tempDatabase({ memory: false })

  // setup module
  let mod = new HierarchyModule(external)
  mod.setup()

  // ensure table is empty
  t.equal(external.prepare(`SELECT * FROM hierarchy`).all().length, 0, 'prior state')

  // insert some data
  let stmt = external.prepare(`
      INSERT INTO hierarchy (parent_source, parent_id, child_source, child_id, depth, branch)
      VALUES (@parent_source, @parent_id, @child_source, @child_id, @depth, @branch)
    `)

  stmt.run({
    parent_source: 'example',
    parent_id: 'id1',
    child_source: 'example',
    child_id: 'id1',
    depth: 0,
    branch: 'default'
  })
  stmt.run({
    parent_source: 'example',
    parent_id: 'id2',
    child_source: 'example',
    child_id: 'id2',
    depth: 0,
    branch: 'default'
  })
  stmt.run({
    parent_source: 'example',
    parent_id: 'id3',
    child_source: 'example',
    child_id: 'id3',
    depth: 0,
    branch: 'default'
  })

  // ensure table is populated
  t.equal(external.prepare(`SELECT * FROM hierarchy`).all().length, 3, 'write')

  // close external database
  external.close()

  // ---

  // generate second database
  let db = common.tempDatabase()

  // setup module on second db
  mod = new HierarchyModule(db)
  mod.setup()

  // attach external database
  db.prepare(`ATTACH DATABASE '${external.name}' as 'external'`).run()

  // ensure external table is populated
  t.equal(db.prepare(`SELECT * FROM external.hierarchy`).all().length, 3, 'external state')

  // table does not exist
  mod.table.hierarchy.merge(db, 'external', 'main')

  // ensure table is merged to main db
  t.equal(db.prepare(`SELECT * FROM hierarchy`).all().length, 3, 'merged')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // setup module
  let mod = new HierarchyModule(db)
  mod.setup()

  // test columns
  let columns = introspect.columns('hierarchy')

  // parent_source
  t.same(columns[0], {
    cid: 0,
    name: 'parent_source',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'parent_source')

  // parent_id
  t.same(columns[1], {
    cid: 1,
    name: 'parent_id',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'parent_id')

  // child_source
  t.same(columns[2], {
    cid: 2,
    name: 'child_source',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'child_source')

  // child_id
  t.same(columns[3], {
    cid: 3,
    name: 'child_id',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'child_id')

  // depth
  t.same(columns[4], {
    cid: 4,
    name: 'depth',
    type: 'INTEGER',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'depth')

  // branch
  t.same(columns[5], {
    cid: 5,
    name: 'branch',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'branch')

  t.end()
})
