const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const Shard = require('./Shard')

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempSpatialDatabase()
    let introspect = new SqliteIntrospect(db)

    // table does not exist
    t.false(introspect.tables().includes('shard'), 'prior state')

    // setup module
    let mod = new Shard(db)
    mod.setup()

    // table exists
    t.true(introspect.tables().includes('shard'), 'create')

    // drop table
    mod.table.shard.drop(db)

    // table does not exist
    t.false(introspect.tables().includes('shard'), 'drop')

    t.end()
  })
}

module.exports.tests.merge = (test, common) => {
  test('merge', (t) => {
    let external = common.tempSpatialDatabase({ memory: false })

    // setup module
    let mod = new Shard(external)
    mod.setup()

    // ensure table is empty
    t.equal(external.prepare(`SELECT * FROM shard`).all().length, 0, 'prior state')

    // insert some data
    let stmt = external.prepare(`
      INSERT INTO shard (source, id, parity, depth, geom)
      VALUES (@source, @id, @parity, @depth, CastToMultiPolygon( Buffer( MakePoint( @lon, @lat, 4326 ), 1 ) ) )
    `)

    stmt.run({ source: 'example', id: 'id1', parity: 1, depth: 1, lat: 1, lon: 1 })
    stmt.run({ source: 'example', id: 'id2', parity: 2, depth: 1, lat: 2, lon: 2 })
    stmt.run({ source: 'example', id: 'id3', parity: 3, depth: 1, lat: 3, lon: 3 })

    // ensure table is populated
    t.equal(external.prepare(`SELECT * FROM shard`).all().length, 3, 'write')

    // close external database
    external.close()

    // ---

    // generate second database
    let db = common.tempSpatialDatabase()

    // setup module on second db
    mod = new Shard(db)
    mod.setup()

    // attach external database
    db.prepare(`ATTACH DATABASE '${external.name}' as 'external'`).run()

    // ensure external table is populated
    t.equal(db.prepare(`SELECT * FROM external.shard`).all().length, 3, 'external state')

    // table does not exist
    mod.table.shard.merge(db, 'external', 'main')

    // ensure table is merged to main db
    t.equal(db.prepare(`SELECT * FROM shard`).all().length, 3, 'merged')

    t.end()
  })
}

module.exports.tests.definition = (test, common) => {
  test('definition', (t) => {
    let db = common.tempSpatialDatabase()
    let introspect = new SqliteIntrospect(db)

    // setup module
    let mod = new Shard(db)
    mod.setup()

    // test columns
    let columns = introspect.columns('shard')

    // source
    t.deepEqual(columns[0], {
      cid: 0,
      name: 'source',
      type: 'TEXT',
      notnull: 1,
      dflt_value: null,
      pk: 0
    }, 'source')

    // id
    t.deepEqual(columns[1], {
      cid: 1,
      name: 'id',
      type: 'TEXT',
      notnull: 1,
      dflt_value: null,
      pk: 0
    }, 'id')

    // parity
    t.deepEqual(columns[2], {
      cid: 2,
      name: 'parity',
      type: 'INTEGER',
      notnull: 1,
      dflt_value: '0',
      pk: 0
    }, 'parity')

    // depth
    t.deepEqual(columns[3], {
      cid: 3,
      name: 'depth',
      type: 'INTEGER',
      notnull: 1,
      dflt_value: '0',
      pk: 0
    }, 'depth')

    // complexity
    t.deepEqual(columns[4], {
      cid: 4,
      name: 'complexity',
      type: 'INTEGER',
      notnull: 0,
      dflt_value: 'NULL',
      pk: 0
    }, 'complexity')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`TableShard: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
