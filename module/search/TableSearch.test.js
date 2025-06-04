const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const NameModule = require('../name/NameModule')
const SearchModule = require('./SearchModule')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // table does not exist
  t.notOk(introspect.tables().includes('search'), 'prior state')

  // set up name module
  let name = new NameModule(db)
  name.setup()

  // set up search module
  let search = new SearchModule(db)
  search.setup()

  // table exists
  t.ok(introspect.tables().includes('search'), 'create')

  // drop table
  search.table.search.drop(db)

  // table does not exist
  t.notOk(introspect.tables().includes('search'), 'drop')

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
  let columns = introspect.columns('search')

  // field:source
  t.same(columns[0], {
    cid: 0,
    name: 'source',
    type: '',
    notnull: 0,
    dflt_value: null,
    pk: 0
  }, 'field:source')

  // field:id
  t.same(columns[1], {
    cid: 1,
    name: 'id',
    type: '',
    notnull: 0,
    dflt_value: null,
    pk: 0
  }, 'field:id')

  // field:lang
  t.same(columns[2], {
    cid: 2,
    name: 'lang',
    type: '',
    notnull: 0,
    dflt_value: null,
    pk: 0
  }, 'field:lang')

  // field:tag
  t.same(columns[3], {
    cid: 3,
    name: 'tag',
    type: '',
    notnull: 0,
    dflt_value: null,
    pk: 0
  }, 'field:tag')

  // field:name
  t.same(columns[4], {
    cid: 4,
    name: 'name',
    type: '',
    notnull: 0,
    dflt_value: null,
    pk: 0
  }, 'field:name')

  t.end()
})
