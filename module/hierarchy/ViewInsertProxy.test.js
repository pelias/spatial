const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableHierarchy = require('./TableHierarchy')
const ViewInsertProxy = require('./ViewInsertProxy')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableHierarchy()
  table.create(db)

  // column does not exist
  t.notOk(introspect.views('hierarchy_insert_proxy').length, 'prior state')

  // create index
  let index = new ViewInsertProxy()
  index.create(db)

  // column exists
  t.ok(introspect.views('hierarchy_insert_proxy').length, 'create')

  // drop index
  index.drop(db)

  // column does not exist
  t.notOk(introspect.views('hierarchy_insert_proxy').length, 'drop')

  t.end()
})
