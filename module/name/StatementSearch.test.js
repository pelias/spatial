const tap = require('tap')
const common = require('../../test/common')
const TableName = require('./TableName')
const StatementInsert = require('./StatementInsert')
const StatementSearch = require('./StatementSearch')

tap.test('function', (t) => {
  let db = common.tempDatabase()

  // create table
  let table = new TableName()
  table.create(db)

  // prepare statements
  let insert = new StatementInsert()
  insert.create(db)

  let search = new StatementSearch()
  search.create(db)

  // table empty
  t.notOk(db.prepare(`SELECT * FROM name`).all().length, 'prior state')

  // insert data
  insert.run({
    source: 'example_source1',
    id: 'example_id1',
    lang: 'example_lang1',
    tag: 'example_tag1',
    abbr: 0,
    name: 'example_name1'
  })
  insert.run({
    source: 'example_source2',
    id: 'example_id2',
    lang: 'example_lang2',
    tag: 'example_tag2',
    abbr: 1,
    name: 'example_name2'
  })
  insert.run({
    source: 'example_source3',
    id: 'example_id3',
    lang: 'example_lang3',
    tag: 'example_tag3',
    abbr: 0,
    name: 'example_name3'
  })

  // ensure data written
  t.equal(db.prepare(`SELECT * FROM name`).all().length, 3, 'write')

  // read data
  let rows = search.all({
    text: 'example_name',
    wildcard: { start: false, end: true },
    limit: 2
  })

  // test response structure
  t.same(rows, [{
    source: 'example_source1',
    id: 'example_id1',
    name: 'example_name1'
  }, {
    source: 'example_source2',
    id: 'example_id2',
    name: 'example_name2'
  }], 'read')

  t.end()
})
