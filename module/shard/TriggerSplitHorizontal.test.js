const format = require('../../import/format')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableShard = require('./TableShard')
const TriggerSplitHorizontal = require('./TriggerSplitHorizontal')
const GeoColumnGeom = require('./GeoColumnGeom')
const StatementInsert = require('./StatementInsert')
const POLYGON = format.from('geometry', 'geojson', require('../../test/fixture/geojson.singapore'))

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
    let trigger = new TriggerSplitHorizontal()
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
    let trigger = new TriggerSplitHorizontal()
    trigger.create(db)

    // test triggers
    let triggers = introspect.triggers('shard')

    // shard_idx_covering
    t.deepEqual(triggers[0], {
      type: 'trigger',
      name: 'shard_split_horizontal_trigger',
      tbl_name: 'shard',
      rootpage: 0,
      sql: `
        CREATE TRIGGER IF NOT EXISTS shard_split_horizontal_trigger
        AFTER UPDATE OF complexity ON main.shard
        WHEN ( LENGTH( NEW.path ) % 2 ) = 1
        AND LENGTH( NEW.path ) <= 50
        AND IFNULL( NEW.complexity, 0 ) > 200
        AND IsValid( NEW.geom ) = 1
        BEGIN
          INSERT OR REPLACE INTO shard( source, id, path, geom )

          /* left half */
          SELECT
            NEW.source, NEW.id, NEW.path || '1',
            CastToMultiPolygon(Intersection(NEW.geom, BuildMbr(
              MbrMinX(NEW.geom),
              MbrMinY(NEW.geom),
              MbrMinX(NEW.geom) + ((MbrMaxX(NEW.geom) - MbrMinX(NEW.geom)) / 2),
              MbrMaxY(NEW.geom)
            ))) AS geom
          FROM shard
          WHERE shard.rowid = NEW.rowid
          AND IsValid( geom ) = 1

          UNION ALL

          /* right half */
          SELECT
            NEW.source, NEW.id, NEW.path || '2',
            CastToMultiPolygon(Intersection(NEW.geom, BuildMbr(
              MbrMinX( geom ) + (( MbrMaxX( geom ) - MbrMinX( geom )) / 2),
              MbrMinY( geom ),
              MbrMaxX( geom ),
              MbrMaxY( geom )
            ))) AS geom
          FROM shard
          WHERE shard.rowid = NEW.rowid
          AND IsValid( geom ) = 1;

          /* clean up */
          DELETE FROM shard
          WHERE rowid = NEW.rowid
          AND CHANGES() == 2;
        END
      `.trim().replace(' IF NOT EXISTS', '')
    }, 'shard_split_horizontal_trigger')

    t.end()
  })
}

module.exports.tests.function = (test, common) => {
  test('function', (t) => {
    let db = common.tempSpatialDatabase()

    // enable recursive triggers
    db.prepare(`PRAGMA recursive_triggers = ON`).run()

    // create table
    let table = new TableShard()
    table.create(db)

    // create geo column
    let column = new GeoColumnGeom()
    column.create(db)

    // create trigger
    let trigger = new TriggerSplitHorizontal({
      shard: {
        complexity: 100,
        path: '01'
      }
    })
    trigger.create(db)

    // prepare statement
    let stmt = new StatementInsert()
    stmt.create(db)

    // table empty
    t.equal(db.prepare(`SELECT COUNT(*) AS cnt FROM shard`).get().cnt, 0, 'prior state')

    // insert data
    stmt.run({
      source: 'example_source',
      id: 'example_id',
      geom: POLYGON.toWkb()
    })

    // fire the trigger
    db.prepare(`UPDATE shard SET path = '0'`).run()
    db.prepare(`UPDATE shard SET complexity = 338`).run()

    // trigger has split the geometry in half horizontally
    t.deepEqual(db.prepare(`SELECT path FROM shard`).all(), [
      { path: '01' },
      { path: '02' }
    ], 'split')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`TriggerSplitHorizontal: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
