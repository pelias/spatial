const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableGeometry = require('./TableGeometry')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // table does not exist
    t.false(introspect.tables().includes('geometry'), 'prior state')

    // create table
    let table = new TableGeometry()
    table.create(db)

    // table exists
    t.true(introspect.tables().includes('geometry'), 'create')

    // drop table
    table.drop(db)

    // table does not exist
    t.false(introspect.tables().includes('geometry'), 'drop')

    t.end()
  })
}

module.exports.tests.definition = (test, common) => {
  test('definition', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableGeometry()
    table.create(db)

    // test columns
    let columns = introspect.columns('geometry')

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

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`TableGeometry: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
