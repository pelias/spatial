const format = require('../../import/format')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableShard = require('./TableShard')
const TriggerComplexity = require('./TriggerComplexity')
const GeoColumnGeom = require('./GeoColumnGeom')
const StatementInsert = require('./StatementInsert')
const POLYGON = format.from('geometry', 'geojson', require('../../test/fixture/geojson.polygon'))

module.exports.tests = {}

module.exports.tests.create_drop = (test, common) => {
  test('create & drop', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableShard()
    table.create(db)

    // trigger does not exist
    t.false(introspect.triggers('shard').length, 'prior state')

    // create trigger
    let trigger = new TriggerComplexity()
    trigger.create(db)

    // trigger exists
    t.true(introspect.triggers('shard').length, 'create')

    // drop trigger
    trigger.drop(db)

    // trigger does not exist
    t.false(introspect.triggers('shard').length, 'drop')

    t.end()
  })
}

module.exports.tests.definition = (test, common) => {
  test('definition', (t) => {
    let db = common.tempDatabase()
    let introspect = new SqliteIntrospect(db)

    // create table
    let table = new TableShard()
    table.create(db)

    // create trigger
    let trigger = new TriggerComplexity()
    trigger.create(db)

    // test triggers
    let triggers = introspect.triggers('shard')

    // shard_idx_covering
    t.deepEqual(triggers[0], {
      type: 'trigger',
      name: 'shard_complexity_trigger',
      tbl_name: 'shard',
      rootpage: 0,
      sql: `
        CREATE TRIGGER IF NOT EXISTS shard_complexity_trigger
        AFTER INSERT ON main.shard
        WHEN NEW.complexity IS NULL
        BEGIN
          UPDATE shard
          SET complexity = IFNULL( ST_NPoints( geom ), 0 )
          WHERE shard.rowid = NEW.rowid
          AND complexity IS NULL;
        END
      `.trim().replace(' IF NOT EXISTS', '')
    }, 'shard_complexity_trigger')

    t.end()
  })
}

module.exports.tests.function = (test, common) => {
  test('function', (t) => {
    let db = common.tempSpatialDatabase()

    // create table
    let table = new TableShard()
    table.create(db)

    // create geo column
    let column = new GeoColumnGeom()
    column.create(db)

    // create trigger
    let trigger = new TriggerComplexity()
    trigger.create(db)

    // prepare statement
    let stmt = new StatementInsert()
    stmt.create(db)

    // table empty
    t.false(db.prepare(`SELECT * FROM shard`).all().length, 'prior state')

    // insert data
    stmt.run({
      source: 'example_source',
      id: 'example_id',
      geom: POLYGON.toWkb()
    })

    // read data
    let rows = db.prepare(`SELECT *, AsBinary(geom) AS geom FROM shard`).all()

    // trigger has updated the complexity column
    t.equal(rows[0].complexity, 338, 'complexity updated')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`TriggerComplexity: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
