const format = require('../../import/format')
const GeometryModule = require('../geometry/Geometry')
const ShardModule = require('../shard/Shard')
const RelationshipModule = require('./Relationship')

const OUTER = format.from('geometry', 'geojson', {
  'type': 'Polygon',
  'coordinates': [[[-10, -10], [10, -10], [10, 10], [-10, 10], [-10, -10]]]
})

const MIDDLE = format.from('geometry', 'geojson', {
  'type': 'Polygon',
  'coordinates': [[[-5, -5], [5, -5], [5, 5], [-5, 5], [-5, -5]]]
})

const INNER = format.from('geometry', 'geojson', {
  'type': 'Polygon',
  'coordinates': [[[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]]]
})

module.exports.tests = {}

module.exports.tests.function = (test, common) => {
  test('function', (t) => {
    let db = common.tempSpatialDatabase()

    // geometry module
    let geometry = new GeometryModule(db)
    geometry.setup()

    // shard module
    let shard = new ShardModule(db)
    shard.setup()

    // relationship module
    let relationship = new RelationshipModule(db)
    relationship.setup()

    // insert outer square
    geometry.statement.insert.run({
      source: 'example_source1',
      id: 'example_id1',
      role: 'example1',
      geom: OUTER.toWkb()
    })

    // insert middle square
    geometry.statement.insert.run({
      source: 'example_source2',
      id: 'example_id2',
      role: 'example2',
      geom: MIDDLE.toWkb()
    })

    // insert inner square
    geometry.statement.insert.run({
      source: 'example_source3',
      id: 'example_id3',
      role: 'example3',
      geom: INNER.toWkb()
    })

    // ensure data written
    t.equal(db.prepare(`SELECT * FROM geometry`).all().length, 3, 'write')
    t.equal(db.prepare(`SELECT * FROM shard`).all().length, 3, 'write')

    let query = { source: 'example_source2', id: 'example_id2', limit: 10 }

    // test intersects
    t.deepEqual(relationship.statement.intersects.all(query), [{
      source: 'example_source1',
      id: 'example_id1'
    }, {
      source: 'example_source3',
      id: 'example_id3'
    }], 'intersects')

    // test contains
    t.deepEqual(relationship.statement.contains.all(query), [{
      source: 'example_source3',
      id: 'example_id3'
    }], 'contains')

    // test within
    t.deepEqual(relationship.statement.within.all(query), [{
      source: 'example_source1',
      id: 'example_id1'
    }], 'within')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`StatementRelationship: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
