const tap = require('tap')
const common = require('../../test/common')
const NameModule = require('../name/NameModule')
const SearchModule = require('./SearchModule')

tap.test('function', (t) => {
  let db = common.tempDatabase()

  // set up name module
  let name = new NameModule(db)
  name.setup()

  // set up search module
  let search = new SearchModule(db)
  search.setup()

  // table empty
  t.notOk(db.prepare(`SELECT * FROM name`).all().length, 'prior state')

  // insert data
  name.statement.insert.run({
    source: 'example_source1',
    id: 'example_id1',
    lang: 'example_lang1',
    tag: 'example_tag1',
    abbr: 0,
    name: 'example_name1'
  })
  name.statement.insert.run({
    source: 'example_source2',
    id: 'example_id2',
    lang: 'example_lang2',
    tag: 'example_tag2',
    abbr: 1,
    name: 'example_name2'
  })
  name.statement.insert.run({
    source: 'example_source3',
    id: 'example_id3',
    lang: 'example_lang3',
    tag: 'example_tag3',
    abbr: 0,
    name: 'example_name3'
  })

  // ensure data written
  t.equal(db.prepare(`SELECT * FROM name`).all().length, 3, 'write')

  // search
  let rows = search.statement.search.all({
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
