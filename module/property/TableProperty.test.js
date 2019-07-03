const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const Property = require('./Property')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // table does not exist
    t.false(introspect.tables().includes('property'), 'prior state')

    // setup module
    let mod = new Property(db)
    mod.setup()

    // table exists
    t.true(introspect.tables().includes('property'), 'create')

    // drop table
    mod.table.property.drop(db)

    // table does not exist
    t.false(introspect.tables().includes('property'), 'drop')

    t.end()
  })
}

module.exports.tests.merge = (test, common) => {
  test('merge', (t) => {
    let external = common.tempDatabase({ memory: false })

    // setup module
    let mod = new Property(external)
    mod.setup()

    // ensure table is empty
    t.equal(external.prepare(`SELECT * FROM property`).all().length, 0, 'prior state')

    // insert some data
    let stmt = external.prepare(`
      INSERT INTO property (source, id, key, value)
      VALUES (@source, @id, @key, @value)
    `)

    stmt.run({
      source: 'example',
      id: 'id1',
      key: 'foo',
      value: 'bar'
    })
    stmt.run({
      source: 'example',
      id: 'id2',
      key: 'foo',
      value: 'bar'
    })
    stmt.run({
      source: 'example',
      id: 'id3',
      key: 'foo',
      value: 'bar'
    })

    // ensure table is populated
    t.equal(external.prepare(`SELECT * FROM property`).all().length, 3, 'write')

    // close external database
    external.close()

    // ---

    // generate second database
    let db = common.tempDatabase()

    // setup module on second db
    mod = new Property(db)
    mod.setup()

    // attach external database
    db.prepare(`ATTACH DATABASE '${external.name}' as 'external'`).run()

    // ensure external table is populated
    t.equal(db.prepare(`SELECT * FROM external.property`).all().length, 3, 'external state')

    // table does not exist
    mod.table.property.merge(db, 'external', 'main')

    // ensure table is merged to main db
    t.equal(db.prepare(`SELECT * FROM property`).all().length, 3, 'merged')

    t.end()
  })
}

module.exports.tests.definition = (test, common) => {
  test('definition', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // setup module
    let mod = new Property(db)
    mod.setup()

    // test columns
    let columns = introspect.columns('property')

    // source
    t.deepEqual(columns[0], {
      cid: 0,
      name: 'source',
      type: 'TEXT',
      notnull: 1,
      dflt_value: null,
      pk: 0
    }, 'source')

    // id
    t.deepEqual(columns[1], {
      cid: 1,
      name: 'id',
      type: 'TEXT',
      notnull: 1,
      dflt_value: null,
      pk: 0
    }, 'id')

    // key
    t.deepEqual(columns[2], {
      cid: 2,
      name: 'key',
      type: 'TEXT',
      notnull: 1,
      dflt_value: null,
      pk: 0
    }, 'key')

    // value
    t.deepEqual(columns[3], {
      cid: 3,
      name: 'value',
      type: 'TEXT',
      notnull: 1,
      dflt_value: null,
      pk: 0
    }, 'value')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`TableProperty: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
