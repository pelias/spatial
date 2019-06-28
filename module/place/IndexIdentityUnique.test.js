const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TablePlace = require('./TablePlace')
const IndexIdentityUnique = require('./IndexIdentityUnique')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TablePlace()
    table.create(db)

    // index does not exist
    t.false(introspect.indices('place').length, 'prior state')

    // create index
    let index = new IndexIdentityUnique()
    index.create(db)

    // index exists
    t.true(introspect.indices('place').length, 'create')

    // drop index
    index.drop(db)

    // index does not exist
    t.false(introspect.indices('place').length, 'drop')

    t.end()
  })
}

module.exports.tests.definition = (test, common) => {
  test('definition', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TablePlace()
    table.create(db)

    // create index
    let index = new IndexIdentityUnique()
    index.create(db)

    // test indices
    let indices = introspect.indices('place')

    // place_idx_unique
    t.deepEqual(indices[0], {
      seq: 0,
      name: 'place_idx_unique',
      unique: 1,
      origin: 'c',
      partial: 0
    }, 'place_idx_unique')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`IndexIdentityUnique: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
