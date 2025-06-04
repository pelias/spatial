const tap = require('tap')
const common = require('../../test/common')
const TableName = require('./TableName')
const StatementInsert = require('./StatementInsert')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()

  // create table
  let table = new TableName()
  table.create(db)

  // prepare statement
  let stmt = new StatementInsert()
  stmt.create(db)

  // table empty
  t.notOk(db.prepare(`SELECT * FROM name`).all().length, 'prior state')

  // insert data
  let info = stmt.run({
    source: 'example_source',
    id: 'example_id',
    lang: 'example_lang',
    tag: 'example_tag',
    abbr: 1,
    name: 'example_name'
  })

  // insert info
  t.same(info, { changes: 1, lastInsertRowid: 1 }, 'write')

  // read data
  t.same(db.prepare(`SELECT * FROM name`).all(), [{
    source: 'example_source',
    id: 'example_id',
    lang: 'example_lang',
    tag: 'example_tag',
    abbr: 1,
    name: 'example_name'
  }], 'read')

  t.end()
})
