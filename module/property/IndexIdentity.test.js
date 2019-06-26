const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableProperty = require('./TableProperty')
const IndexIdentity = require('./IndexIdentity')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableProperty()
    table.create(db)

    // index does not exist
    t.false(introspect.indices('property').length, 'prior state')

    // create index
    let index = new IndexIdentity()
    index.create(db)

    // index exists
    t.true(introspect.indices('property').length, 'create')

    // drop index
    index.drop(db)

    // index does not exist
    t.false(introspect.indices('property').length, 'drop')

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

    // create index
    let index = new IndexIdentity()
    index.create(db)

    // test indices
    let indices = introspect.indices('property')

    // property_idx_identity
    t.deepEqual(indices[0], {
      seq: 0,
      name: 'property_idx_identity',
      unique: 0,
      origin: 'c',
      partial: 0
    }, 'property_idx_identity')

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
