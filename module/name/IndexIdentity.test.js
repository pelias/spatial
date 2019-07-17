const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableName = require('./TableName')
const IndexIdentity = require('./IndexIdentity')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableName()
    table.create(db)

    // index does not exist
    t.false(introspect.indices('name').length, 'prior state')

    // create index
    let index = new IndexIdentity()
    index.create(db)

    // index exists
    t.true(introspect.indices('name').length, 'create')

    // drop index
    index.drop(db)

    // index does not exist
    t.false(introspect.indices('name').length, 'drop')

    t.end()
  })
}

module.exports.tests.definition = (test, common) => {
  test('definition', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableName()
    table.create(db)

    // create index
    let index = new IndexIdentity()
    index.create(db)

    // test indices
    let indices = introspect.indices('name')

    // name_idx_identity
    t.deepEqual(indices[0], {
      seq: 0,
      name: 'name_idx_identity',
      unique: 0,
      origin: 'c',
      partial: 0
    }, 'name_idx_identity')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`IndexIdentity: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
