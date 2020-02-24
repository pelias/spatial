const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TablePlace = require('./TablePlace')
const IndexOntology = require('./IndexOntology')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TablePlace()
  table.create(db)

  // index does not exist
  t.false(introspect.indices('place').length, 'prior state')

  // create index
  let index = new IndexOntology()
  index.create(db)

  // index exists
  t.true(introspect.indices('place').length, 'create')

  // drop index
  index.drop(db)

  // index does not exist
  t.false(introspect.indices('place').length, 'drop')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TablePlace()
  table.create(db)

  // create index
  let index = new IndexOntology()
  index.create(db)

  // test indices
  let indices = introspect.indices('place')

  // place_idx_ontology
  t.deepEqual(indices[0], {
    seq: 0,
    name: 'place_idx_ontology',
    unique: 0,
    origin: 'c',
    partial: 0
  }, 'place_idx_ontology')

  t.end()
})
