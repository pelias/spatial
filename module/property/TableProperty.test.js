const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableProperty = require('./TableProperty')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // table does not exist
    t.false(introspect.tables().includes('property'), 'prior state')

    // create table
    let table = new TableProperty()
    table.create(db)

    // table exists
    t.true(introspect.tables().includes('property'), 'create')

    // drop table
    table.drop(db)

    // table does not exist
    t.false(introspect.tables().includes('property'), 'drop')

    t.end()
  })
}

module.exports.tests.definition = (test, common) => {
  test('definition', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableProperty()
    table.create(db)

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
