const tap = require('tap')
const common = require('../../test/common')
const TablePlace = require('./TablePlace')
const StatementInsert = require('./StatementInsert')
const StatementOntology = require('./StatementOntology')

tap.test('functional - list classes', (t) => {
  let db = common.tempDatabase()

  // create table
  let table = new TablePlace()
  table.create(db)

  // prepare statements
  let insert = new StatementInsert()
  insert.create(db)

  let ontology = new StatementOntology()
  ontology.create(db)

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
  let row = ontology.all({
    limit: 100
  })

  // test response structure
  t.same(row, [{
    class: 'example_class_1',
    total: 2
  }, {
    class: 'example_class_2',
    total: 1
  }], 'read')

  t.end()
})

tap.test('functional - list types', (t) => {
  let db = common.tempDatabase()

  // create table
  let table = new TablePlace()
  table.create(db)

  // prepare statements
  let insert = new StatementInsert()
  insert.create(db)

  let ontology = new StatementOntology()
  ontology.create(db)

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
  let row = ontology.all({
    class: 'example_class_1',
    limit: 100
  })

  // test response structure
  t.same(row, [{
    type: 'example_type_1',
    total: 1
  }, {
    type: 'example_type_2',
    total: 1
  }], 'read')

  t.end()
})

tap.test('functional - search by class & type', (t) => {
  let db = common.tempDatabase()

  // create table
  let table = new TablePlace()
  table.create(db)

  // prepare statements
  let insert = new StatementInsert()
  insert.create(db)

  let ontology = new StatementOntology()
  ontology.create(db)

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
  let row = ontology.all({
    class: 'example_class_1',
    type: 'example_type_2',
    limit: 100
  })

  // test response structure
  t.same(row, [{
    source: 'example_source',
    id: 'example_id'
  }], 'read')

  t.end()
})
