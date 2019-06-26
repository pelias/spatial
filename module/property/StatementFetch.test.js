const TableProperty = require('./TableProperty')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')

module.exports.tests = {}

module.exports.tests.function = (test, common) => {
  test('function', (t) => {
    let db = common.tempDatabase()

    // create table
    let table = new TableProperty()
    table.create(db)

    // prepare statements
    let insert = new StatementInsert()
    insert.create(db)

    let fetch = new StatementFetch()
    fetch.create(db)

    // table empty
    t.false(db.prepare(`SELECT * FROM property`).all().length, 'prior state')

    // insert data
    insert.run({
      source: 'example_source',
      id: 'example_id',
      key: 'example_key_1',
      value: 'example_value_1'
    })
    insert.run({
      source: 'example_source',
      id: 'example_id',
      key: 'example_key_2',
      value: 'example_value_2'
    })
    insert.run({
      source: 'example_source',
      id: 'example_id',
      key: 'example_key_3',
      value: 'example_value_3'
    })

    // ensure data written
    t.equal(db.prepare(`SELECT * FROM property`).all().length, 3, 'write')

    // read data
    let rows = fetch.all({
      source: 'example_source',
      id: 'example_id',
      limit: 2
    })

    // test response structure
    t.deepEqual(rows, [{
      key: 'example_key_1',
      value: 'example_value_1'
    }, {
      key: 'example_key_2',
      value: 'example_value_2'
    }], 'read')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`StatementFetch: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
