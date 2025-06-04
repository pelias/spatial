const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const NameModule = require('../name/NameModule')
const SearchModule = require('./SearchModule')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // table does not exist
  t.notOk(introspect.tables().includes('search_vocab'), 'prior state')

  // set up name module
  let name = new NameModule(db)
  name.setup()

  // set up search module
  let search = new SearchModule(db)
  search.setup()

  // table exists
  t.ok(introspect.tables().includes('search_vocab'), 'create')

  // drop table
  search.table.vocab.drop(db)

  // table does not exist
  t.notOk(introspect.tables().includes('search_vocab'), 'drop')

  t.end()
})

tap.test('definition', (t) => {
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
  t.same(columns[0], {
    cid: 0,
    name: 'term',
    type: '',
    notnull: 0,
    dflt_value: null,
    pk: 0
  }, 'term')

  // doc
  t.same(columns[1], {
    cid: 1,
    name: 'doc',
    type: '',
    notnull: 0,
    dflt_value: null,
    pk: 0
  }, 'doc')

  // col
  t.same(columns[2], {
    cid: 2,
    name: 'col',
    type: '',
    notnull: 0,
    dflt_value: null,
    pk: 0
  }, 'col')

  // offset
  t.same(columns[3], {
    cid: 3,
    name: 'offset',
    type: '',
    notnull: 0,
    dflt_value: null,
    pk: 0
  }, 'offset')

  t.end()
})
