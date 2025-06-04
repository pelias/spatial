const tap = require('tap')
const common = require('../../test/common')
const TablePlace = require('./TablePlace')
const StatementInsert = require('./StatementInsert')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()

  // create table
  let table = new TablePlace()
  table.create(db)

  // prepare statement
  let stmt = new StatementInsert()
  stmt.create(db)

  // table empty
  t.notOk(db.prepare(`SELECT * FROM place`).all().length, 'prior state')

  // insert data
  let info = stmt.run({
    source: 'example_source',
    id: 'example_id',
    class: 'example_class',
    type: 'example_type'
  })

  // insert info
  t.same(info, { changes: 1, lastInsertRowid: 1 }, 'write')

  // read data
  t.same(db.prepare(`SELECT * FROM place`).all(), [{
    source: 'example_source',
    id: 'example_id',
    class: 'example_class',
    type: 'example_type'
  }], 'read')

  t.end()
})
