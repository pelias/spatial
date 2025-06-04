const tap = require('tap')
const common = require('../../test/common')
const TablePlace = require('./TablePlace')
const StatementInsert = require('./StatementInsert')
const StatementOntologyIndex = require('./StatementOntologyIndex')

tap.test('functional - create nested index of whole ontology', (t) => {
  let db = common.tempDatabase()

  // create table
  let table = new TablePlace()
  table.create(db)

  // prepare statements
  let insert = new StatementInsert()
  insert.create(db)

  let ontologyIndex = new StatementOntologyIndex()
  ontologyIndex.create(db)

  // table empty
  t.notOk(db.prepare(`SELECT * FROM place`).all().length, 'prior state')

  // insert data
  insert.run({
    source: 'example_source',
    id: 'example_id',
    class: 'example_class_1',
    type: 'example_type_1'
  })
  insert.run({
    source: 'example_source',
    id: 'example_id',
    class: 'example_class_1',
    type: 'example_type_2'
  })
  insert.run({
    source: 'example_source',
    id: 'example_id',
    class: 'example_class_2',
    type: 'example_type_3'
  })

  // ensure data written
  t.equal(db.prepare(`SELECT * FROM place`).all().length, 3, 'write')

  // read data
  let ontology = ontologyIndex.all({})

  // test response structure
  t.same(ontology, [{
    class: 'example_class_1',
    total: 2,
    type: [
      {
        'type': 'example_type_1',
        'total': 1
      },
      {
        'type': 'example_type_2',
        'total': 1
      }
    ]
  }, {
    class: 'example_class_2',
    total: 1,
    type: [
      {
        'type': 'example_type_3',
        'total': 1
      }
    ]
  }], 'read')

  t.end()
})
