const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableHierarchy = require('./TableHierarchy')
const ViewInsertProxy = require('./ViewInsertProxy')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableHierarchy()
    table.create(db)

    // column does not exist
    t.false(introspect.views('hierarchy_insert_proxy').length, 'prior state')

    // create index
    let index = new ViewInsertProxy()
    index.create(db)

    // column exists
    t.true(introspect.views('hierarchy_insert_proxy').length, 'create')

    // drop index
    index.drop(db)

    // column does not exist
    t.false(introspect.views('hierarchy_insert_proxy').length, 'drop')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`ViewInsertProxy: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
