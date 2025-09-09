const tap = require('tap')
const format = require('../../import/format')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const PointInPolygonModule = require('./PointInPolygonModule')
const GeometryModule = require('../geometry/GeometryModule')
const PlaceModule = require('../place/PlaceModule')
const NameModule = require('../name/NameModule')
const ShardModule = require('../shard/ShardModule')
const HierarchyModule = require('../hierarchy/HierarchyModule')

const installDependencies = (db) => {
  new NameModule(db).setup()
  new PlaceModule(db).setup()
  new HierarchyModule(db).setup()
  new GeometryModule(db).setup()
  new ShardModule(db).setup()
}

tap.test('create & drop', (t) => {
  let db = common.tempSpatialDatabase()
  let introspect = new SqliteIntrospect(db)

  installDependencies(db)

  // table does not exist
  t.notOk(introspect.tables().includes('summary'), 'prior state')

  // setup module
  let pip = new PointInPolygonModule(db)
  pip.setup()

  // table exists
  t.ok(introspect.tables().includes('summary'), 'create')

  // drop table
  pip.table.summary.drop(db)

  // table does not exist
  t.notOk(introspect.tables().includes('summary'), 'drop')

  t.end()
})

tap.test('merge', (t) => {
  let external = common.tempSpatialDatabase({ memory: false })
  installDependencies(external)

  // set up pip module
  let pip = new PointInPolygonModule(external)
  pip.setup()

  // ensure table is empty
  t.equal(external.prepare(`SELECT * FROM summary`).all().length, 0, 'prior state')

  // insert some data
  let stmt = external.prepare(`
    INSERT INTO summary (source, id, class, type, name, abbr, centroid, bounds)
    VALUES (@source, @id, @class, @type, @name, @abbr, @centroid, @bounds)
  `)

  stmt.run({
    source: 'example',
    id: 'id1',
    class: 'admin',
    type: 'test',
    name: 'name1',
    abbr: 'abbr1',
    centroid: 'centroid1',
    bounds: 'bounds1'
  })
  stmt.run({
    source: 'example',
    id: 'id2',
    class: 'admin',
    type: 'test',
    name: 'name2',
    abbr: 'abbr2',
    centroid: 'centroid2',
    bounds: 'bounds2'
  })
  stmt.run({
    source: 'example',
    id: 'id3',
    class: 'admin',
    type: 'test',
    name: 'name1',
    abbr: null,
    centroid: 'centroid3',
    bounds: 'bounds3'
  })

  // ensure table is populated
  t.equal(external.prepare(`SELECT * FROM summary`).all().length, 3, 'write')

  // close external database
  external.close()

  // ---

  // generate second database
  let db = common.tempSpatialDatabase()
  installDependencies(db)

  // setup module on second db
  let mod = new PointInPolygonModule(db)
  mod.setup()

  // attach external database
  db.prepare(`ATTACH DATABASE '${external.name}' as 'external'`).run()

  // ensure external table is populated
  t.equal(db.prepare(`SELECT * FROM external.summary`).all().length, 3, 'external state')

  // table does not exist
  mod.table.summary.merge(db, 'external', 'main')

  // ensure table is merged to main db
  t.equal(db.prepare(`SELECT * FROM summary`).all().length, 3, 'merged')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempSpatialDatabase()
  installDependencies(db)

  let introspect = new SqliteIntrospect(db)

  // setup module
  let mod = new PointInPolygonModule(db)
  mod.setup()

  // test columns
  let columns = introspect.columns('summary')

  // source
  t.same(columns[0], {
    cid: 0,
    name: 'source',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 1
  }, 'source')

  // id
  t.same(columns[1], {
    cid: 1,
    name: 'id',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 2
  }, 'id')

  // class
  t.same(columns[2], {
    cid: 2,
    name: 'class',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'class')

  // type
  t.same(columns[3], {
    cid: 3,
    name: 'type',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'type')

  // name
  t.same(columns[4], {
    cid: 4,
    name: 'name',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'name')

  // abbr
  t.same(columns[5], {
    cid: 5,
    name: 'abbr',
    type: 'TEXT',
    notnull: 0,
    dflt_value: null,
    pk: 0
  }, 'abbr')

  // centroid
  t.same(columns[6], {
    cid: 6,
    name: 'centroid',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'centroid')

  // bounds
  t.same(columns[7], {
    cid: 7,
    name: 'bounds',
    type: 'TEXT',
    notnull: 1,
    dflt_value: null,
    pk: 0
  }, 'bounds')

  t.end()
})

tap.test('populate', (t) => {
  let db = common.tempSpatialDatabase()

  let name = new NameModule(db)
  name.setup()

  let place = new PlaceModule(db)
  place.setup()

  let hierarchy = new HierarchyModule(db)
  hierarchy.setup()

  let geometry = new GeometryModule(db)
  geometry.setup()

  let shard = new ShardModule(db)
  shard.setup()

  // setup module
  let pip = new PointInPolygonModule(db)
  pip.setup()

  // nothing in dependent tables

  // run the close method and check for values in the summary table
  pip.table.summary.close(db, {})
  t.same(db.prepare(`SELECT * FROM summary`).all(), [])

  // insert values in dependent tables
  const identity = { source: 'example', id: '1' }

  // insert into place
  place.statement.insert.run({ ...identity, class: 'aclass', type: 'atype' })
  t.equal(db.prepare(`SELECT * FROM place`).all().length, 1)

  // insert into name
  name.statement.insert.run({ ...identity, lang: 'und', tag: 'default', abbr: 0, name: 'aname' })
  name.statement.insert.run({ ...identity, lang: 'und', tag: 'default', abbr: 1, name: 'anabbr' })
  t.equal(db.prepare(`SELECT * FROM name`).all().length, 2)

  // insert into geometry
  const centroid = format.from('point', 'geojson', { coordinates: [1, 1] })
  const envelope = format.from('polygon', 'geojson', {
    coordinates: [[[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]]]
  })
  geometry.statement.insert.run({ ...identity, role: 'centroid', geom: centroid.toWkb() })
  geometry.statement.insert.run({ ...identity, role: 'envelope', geom: envelope.toWkb() })
  t.equal(db.prepare(`SELECT * FROM geometry`).all().length, 2)

  // run the close method and check for values in the summary table
  pip.table.summary.close(db, {})
  t.same(db.prepare(`SELECT * FROM summary`).all(), [{
    source: 'example',
    id: '1',
    class: 'aclass',
    type: 'atype',
    name: 'aname',
    abbr: 'anabbr',
    centroid: '1.0,1.0',
    bounds: '1.0,1.0,2.0,2.0'
  }])

  t.end()
})
