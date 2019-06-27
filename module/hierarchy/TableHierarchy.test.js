const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableHierarchy = require('./TableHierarchy')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // table does not exist
    t.false(introspect.tables().includes('hierarchy'), 'prior state')

    // create table
    let table = new TableHierarchy()
    table.create(db)

    // table exists
    t.true(introspect.tables().includes('hierarchy'), 'create')

    // drop table
    table.drop(db)

    // table does not exist
    t.false(introspect.tables().includes('hierarchy'), 'drop')

    t.end()
  })
}

module.exports.tests.definition = (test, common) => {
  test('definition', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableHierarchy()
    table.create(db)

    // test columns
    let columns = introspect.columns('hierarchy')

    // parent_source
    t.deepEqual(columns[0], {
      cid: 0,
      name: 'parent_source',
      type: 'TEXT',
      notnull: 1,
      dflt_value: null,
      pk: 0
    }, 'parent_source')

    // parent_id
    t.deepEqual(columns[1], {
      cid: 1,
      name: 'parent_id',
      type: 'TEXT',
      notnull: 1,
      dflt_value: null,
      pk: 0
    }, 'parent_id')

    // child_source
    t.deepEqual(columns[2], {
      cid: 2,
      name: 'child_source',
      type: 'TEXT',
      notnull: 1,
      dflt_value: null,
      pk: 0
    }, 'child_source')

    // child_id
    t.deepEqual(columns[3], {
      cid: 3,
      name: 'child_id',
      type: 'TEXT',
      notnull: 1,
      dflt_value: null,
      pk: 0
    }, 'child_id')

    // depth
    t.deepEqual(columns[4], {
      cid: 4,
      name: 'depth',
      type: 'INTEGER',
      notnull: 1,
      dflt_value: null,
      pk: 0
    }, 'depth')

    // branch
    t.deepEqual(columns[5], {
      cid: 5,
      name: 'branch',
      type: 'TEXT',
      notnull: 1,
      dflt_value: null,
      pk: 0
    }, 'branch')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`TableHierarchy: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
