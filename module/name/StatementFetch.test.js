const tap = require('tap')
const common = require('../../test/common')
const TableName = require('./TableName')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')

tap.test('function', (t) => {
  let db = common.tempDatabase()

  // create table
  let table = new TableName()
  table.create(db)

  // prepare statements
  let insert = new StatementInsert()
  insert.create(db)

  let fetch = new StatementFetch()
  fetch.create(db)

  // table empty
  t.notOk(db.prepare(`SELECT * FROM name`).all().length, 'prior state')

  // insert data
  insert.run({
    source: 'example_source',
    id: 'example_id',
    lang: 'example_lang1',
    tag: 'example_tag1',
    abbr: 0,
    name: 'example_name1'
  })
  insert.run({
    source: 'example_source',
    id: 'example_id',
    lang: 'example_lang2',
    tag: 'example_tag2',
    abbr: 1,
    name: 'example_name2'
  })
  insert.run({
    source: 'example_source',
    id: 'example_id',
    lang: 'example_lang3',
    tag: 'example_tag3',
    abbr: 0,
    name: 'example_name3'
  })

  // ensure data written
  t.equal(db.prepare(`SELECT * FROM name`).all().length, 3, 'write')

  // read data
  let rows = fetch.all({
    source: 'example_source',
    id: 'example_id',
    limit: 2
  })

  // test response structure
  t.same(rows, [{
    lang: 'example_lang1',
    tag: 'example_tag1',
    abbr: false,
    name: 'example_name1'
  }, {
    lang: 'example_lang2',
    tag: 'example_tag2',
    abbr: true,
    name: 'example_name2'
  }], 'read')

  t.end()
})
