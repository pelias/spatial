const TablePlace = require('./TablePlace')
const StatementInsert = require('./StatementInsert')
const StatementFetch = require('./StatementFetch')

module.exports.tests = {}

module.exports.tests.function = (test, common) => {
  test('function', (t) => {
    let db = common.tempDatabase()

    // create table
    let table = new TablePlace()
    table.create(db)

    // prepare statements
    let insert = new StatementInsert()
    insert.create(db)

    let fetch = new StatementFetch()
    fetch.create(db)

    // table empty
    t.false(db.prepare(`SELECT * FROM place`).all().length, 'prior state')

    // insert data
    insert.run({
      source: 'example_source',
      id: 'example_id',
      class: 'example_class_1',
      type: 'example_type_1'
    })

    // ensure data written
    t.equal(db.prepare(`SELECT * FROM place`).all().length, 1, 'write')

    // read data
    let row = fetch.get({
      source: 'example_source',
      id: 'example_id'
    })

    // test response structure
    t.deepEqual(row, {
      source: 'example_source',
      id: 'example_id',
      class: 'example_class_1',
      type: 'example_type_1'
    }, 'read')

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
