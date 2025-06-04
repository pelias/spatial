const tap = require('tap')
const common = require('../../test/common')
const format = require('../../import/format')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableShard = require('./TableShard')
const GeometryModule = require('../geometry/GeometryModule')
const ShardModule = require('./ShardModule')
const TriggerGeometryInsert = require('./TriggerGeometryInsert')
const POLYGON = format.from('geometry', 'geojson', require('../../test/fixture/geojson.singapore'))

const filter = function (t) { return t.name === 'shard_geometry_insert' }

tap.test('create & drop', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // set up geometry module
  let mod = new GeometryModule(db)
  mod.setup()

  // create table
  let table = new TableShard()
  table.create(db)

  // trigger does not exist
  t.notOk(introspect.triggers('geometry').filter(filter).length, 'prior state')

  // create trigger
  let trigger = new TriggerGeometryInsert()
  trigger.create(db)

  // trigger exists
  t.ok(introspect.triggers('geometry').filter(filter).length, 'create')

  // drop trigger
  trigger.drop(db)

  // trigger does not exist
  t.notOk(introspect.triggers('geometry').filter(filter).length, 'drop')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  // set up geometry module
  let mod = new GeometryModule(db)
  mod.setup()

  // create table
  let table = new TableShard()
  table.create(db)

  // create trigger
  let trigger = new TriggerGeometryInsert()
  trigger.create(db)

  // test triggers
  let triggers = introspect.triggers('geometry').filter(filter)

  // shard_idx_covering
  t.same(triggers[0], {
    type: 'trigger',
    name: 'shard_geometry_insert',
    tbl_name: 'geometry',
    rootpage: 0,
    sql: `
      CREATE TRIGGER IF NOT EXISTS shard_geometry_insert
        AFTER INSERT ON main.geometry
        -- only polygon types currently supported
        WHEN GeometryType( NEW.geom ) IN ('POLYGON', 'MULTIPOLYGON')
        AND UPPER( NEW.role ) IN ( 'BOUNDARY', 'BUFFER' )
        BEGIN

          -- remove prior shards for same geometry
          DELETE FROM shard
          WHERE source = NEW.source
          AND id = NEW.id;

          -- insert collection into tmp table
          INSERT INTO shard_subdivide (geom)
          SELECT ST_Subdivide(NEW.geom, 200)
          WHERE NEW.geom IS NOT NULL;

          -- insert shards in to shard table
          INSERT INTO shard (source, id, role, element, geom)
          SELECT
            NEW.source,
            NEW.id,
            NEW.role,
            t.item_no,
            t.geometry
          FROM ElementaryGeometries AS t
          WHERE f_table_name = 'shard_subdivide'
          AND origin_rowid = last_insert_rowid();

          -- truncate & reset tmp table
          DELETE FROM shard_subdivide;
          DELETE from sqlite_sequence WHERE name='shard_subdivide';
        END
      `.trim().replace(' IF NOT EXISTS', '')
  }, 'shard_geometry_insert')

  t.end()
})

tap.test('functional - boundary', (t) => {
  let db = common.tempSpatialDatabase()

  // set up geometry module
  let geometry = new GeometryModule(db)
  geometry.setup()

  // set up shard module
  let shard = new ShardModule(db)
  shard.setup()

  // create trigger
  let trigger = new TriggerGeometryInsert({
    shard: {
      complexity: 100,
      path: '01'
    }
  })
  trigger.create(db)

  // table empty
  t.equal(db.prepare(`SELECT COUNT(*) AS cnt FROM shard`).get().cnt, 0, 'prior state')

  // insert data in to geometry column (which fires the triggeer)
  geometry.statement.insert.run({
    source: 'example_source',
    id: 'example_id',
    role: 'boundary',
    element: 1,
    geom: POLYGON.toWkb()
  })

  // trigger has split the geometry in half horizontally
  t.same(db.prepare(`SELECT element FROM shard`).all(), [
    { element: 0 },
    { element: 1 },
    { element: 2 },
    { element: 3 },
    { element: 4 },
    { element: 5 },
    { element: 6 },
    { element: 7 },
    { element: 8 },
    { element: 9 },
    { element: 10 },
    { element: 11 },
    { element: 12 },
    { element: 13 },
    { element: 14 },
    { element: 15 },
    { element: 16 },
    { element: 17 },
    { element: 18 },
    { element: 19 },
    { element: 20 },
    { element: 21 },
    { element: 22 },
    { element: 23 },
    { element: 24 },
    { element: 25 },
    { element: 26 },
    { element: 27 },
    { element: 28 },
    { element: 29 },
    { element: 30 },
    { element: 31 },
    { element: 32 },
    { element: 33 },
    { element: 34 },
    { element: 35 },
    { element: 36 },
    { element: 37 },
    { element: 38 }
  ], 'split')

  t.end()
})
tap.test('functional - buffer', (t) => {
  let db = common.tempSpatialDatabase()

  // set up geometry module
  let geometry = new GeometryModule(db)
  geometry.setup()

  // set up shard module
  let shard = new ShardModule(db)
  shard.setup()

  // create trigger
  let trigger = new TriggerGeometryInsert({
    shard: {
      complexity: 100,
      path: '01'
    }
  })
  trigger.create(db)

  // table empty
  t.equal(db.prepare(`SELECT COUNT(*) AS cnt FROM shard`).get().cnt, 0, 'prior state')

  // insert data in to geometry column (which fires the triggeer)
  geometry.statement.insert.run({
    source: 'example_source',
    id: 'example_id',
    role: 'buffer',
    element: 1,
    geom: POLYGON.toWkb()
  })

  // trigger has split the geometry in half horizontally
  t.same(db.prepare(`SELECT element FROM shard`).all(), [
    { element: 0 },
    { element: 1 },
    { element: 2 },
    { element: 3 },
    { element: 4 },
    { element: 5 },
    { element: 6 },
    { element: 7 },
    { element: 8 },
    { element: 9 },
    { element: 10 },
    { element: 11 },
    { element: 12 },
    { element: 13 },
    { element: 14 },
    { element: 15 },
    { element: 16 },
    { element: 17 },
    { element: 18 },
    { element: 19 },
    { element: 20 },
    { element: 21 },
    { element: 22 },
    { element: 23 },
    { element: 24 },
    { element: 25 },
    { element: 26 },
    { element: 27 },
    { element: 28 },
    { element: 29 },
    { element: 30 },
    { element: 31 },
    { element: 32 },
    { element: 33 },
    { element: 34 },
    { element: 35 },
    { element: 36 },
    { element: 37 },
    { element: 38 }
  ], 'split')

  t.end()
})
