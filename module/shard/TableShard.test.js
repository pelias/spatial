const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableShard = require('./TableShard')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // table does not exist
    t.false(introspect.tables().includes('shard'), 'prior state')

    // create table
    let table = new TableShard()
    table.create(db)

    // table exists
    t.true(introspect.tables().includes('shard'), 'create')

    // drop table
    table.drop(db)

    // table does not exist
    t.false(introspect.tables().includes('shard'), 'drop')

    t.end()
  })
}

module.exports.tests.definition = (test, common) => {
  test('definition', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableShard()
    table.create(db)

    // test columns
    let columns = introspect.columns('shard')

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

    // parity
    t.deepEqual(columns[2], {
      cid: 2,
      name: 'parity',
      type: 'INTEGER',
      notnull: 1,
      dflt_value: '0',
      pk: 0
    }, 'parity')

    // depth
    t.deepEqual(columns[3], {
      cid: 3,
      name: 'depth',
      type: 'INTEGER',
      notnull: 1,
      dflt_value: '0',
      pk: 0
    }, 'depth')

    // complexity
    t.deepEqual(columns[4], {
      cid: 4,
      name: 'complexity',
      type: 'INTEGER',
      notnull: 0,
      dflt_value: 'NULL',
      pk: 0
    }, 'complexity')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`TableShard: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
