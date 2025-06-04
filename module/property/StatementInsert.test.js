const tap = require('tap')
const common = require('../../test/common')
const TableProperty = require('./TableProperty')
const StatementInsert = require('./StatementInsert')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()

  // create table
  let table = new TableProperty()
  table.create(db)

  // prepare statement
  let stmt = new StatementInsert()
  stmt.create(db)

  // table empty
  t.notOk(db.prepare(`SELECT * FROM property`).all().length, 'prior state')

  // insert data
  let info = stmt.run({
    source: 'example_source',
    id: 'example_id',
    key: 'example_key',
    value: 'example_value'
  })

  // insert info
  t.same(info, { changes: 1, lastInsertRowid: 1 }, 'write')

  // read data
  t.same(db.prepare(`SELECT * FROM property`).all(), [{
    source: 'example_source',
    id: 'example_id',
    key: 'example_key',
    value: 'example_value'
  }], 'read')

  t.end()
})
