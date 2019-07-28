const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const NameModule = require('../name/NameModule')
const SearchModule = require('./SearchModule')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // table does not exist
    t.false(introspect.tables().includes('search_vocab'), 'prior state')

    // set up name module
    let name = new NameModule(db)
    name.setup()

    // set up search module
    let search = new SearchModule(db)
    search.setup()

    // table exists
    t.true(introspect.tables().includes('search_vocab'), 'create')

    // drop table
    search.table.vocab.drop(db)

    // table does not exist
    t.false(introspect.tables().includes('search_vocab'), 'drop')

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
    let columns = introspect.columns('search_vocab')

    // term
    t.deepEqual(columns[0], {
      cid: 0,
      name: 'term',
      type: '',
      notnull: 0,
      dflt_value: null,
      pk: 0
    }, 'term')

    // doc
    t.deepEqual(columns[1], {
      cid: 1,
      name: 'doc',
      type: '',
      notnull: 0,
      dflt_value: null,
      pk: 0
    }, 'doc')

    // col
    t.deepEqual(columns[2], {
      cid: 2,
      name: 'col',
      type: '',
      notnull: 0,
      dflt_value: null,
      pk: 0
    }, 'col')

    // offset
    t.deepEqual(columns[3], {
      cid: 3,
      name: 'offset',
      type: '',
      notnull: 0,
      dflt_value: null,
      pk: 0
    }, 'offset')

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
