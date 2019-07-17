const TableName = require('./TableName')
const StatementInsert = require('./StatementInsert')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()

    // create table
    let table = new TableName()
    table.create(db)

    // prepare statement
    let stmt = new StatementInsert()
    stmt.create(db)

    // table empty
    t.false(db.prepare(`SELECT * FROM name`).all().length, 'prior state')

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
    t.deepEqual(info, { changes: 1, lastInsertRowid: 1 }, 'write')

    // read data
    t.deepEqual(db.prepare(`SELECT * FROM name`).all(), [{
      source: 'example_source',
      id: 'example_id',
      lang: 'example_lang',
      tag: 'example_tag',
      abbr: 1,
      name: 'example_name'
    }], 'read')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`StatementInsert: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
