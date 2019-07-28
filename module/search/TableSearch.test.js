const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const NameModule = require('../name/NameModule')
const SearchModule = require('./SearchModule')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // table does not exist
    t.false(introspect.tables().includes('search'), 'prior state')

    // set up name module
    let name = new NameModule(db)
    name.setup()

    // set up search module
    let search = new SearchModule(db)
    search.setup()

    // table exists
    t.true(introspect.tables().includes('search'), 'create')

    // drop table
    search.table.search.drop(db)

    // table does not exist
    t.false(introspect.tables().includes('search'), 'drop')

    t.end()
  })
}

module.exports.tests.definition = (test, common) => {
  test('definition', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // set up name module
    let name = new NameModule(db)
    name.setup()

    // set up search module
    let search = new SearchModule(db)
    search.setup()

    // test columns
    let columns = introspect.columns('search')

    // field:source
    t.deepEqual(columns[0], {
      cid: 0,
      name: 'source',
      type: '',
      notnull: 0,
      dflt_value: null,
      pk: 0
    }, 'field:source')

    // field:id
    t.deepEqual(columns[1], {
      cid: 1,
      name: 'id',
      type: '',
      notnull: 0,
      dflt_value: null,
      pk: 0
    }, 'field:id')

    // field:lang
    t.deepEqual(columns[2], {
      cid: 2,
      name: 'lang',
      type: '',
      notnull: 0,
      dflt_value: null,
      pk: 0
    }, 'field:lang')

    // field:tag
    t.deepEqual(columns[3], {
      cid: 3,
      name: 'tag',
      type: '',
      notnull: 0,
      dflt_value: null,
      pk: 0
    }, 'field:tag')

    // field:name
    t.deepEqual(columns[4], {
      cid: 4,
      name: 'name',
      type: '',
      notnull: 0,
      dflt_value: null,
      pk: 0
    }, 'field:name')

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
