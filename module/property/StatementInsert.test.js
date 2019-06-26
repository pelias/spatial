const TableProperty = require('./TableProperty')
const StatementInsert = require('./StatementInsert')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()

    // create table
    let table = new TableProperty()
    table.create(db)

    // prepare statement
    let stmt = new StatementInsert()
    stmt.create(db)

    // table empty
    t.false(db.prepare(`SELECT * FROM property`).all().length, 'prior state')

    // insert data
    let info = stmt.run({
      source: 'example_source',
      id: 'example_id',
      key: 'example_key',
      value: 'example_value'
    })

    // insert info
    t.deepEqual(info, { changes: 1, lastInsertRowid: 1 }, 'write')

    // read data
    t.deepEqual(db.prepare(`SELECT * FROM property`).all(), [{
      source: 'example_source',
      id: 'example_id',
      key: 'example_key',
      value: 'example_value'
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
