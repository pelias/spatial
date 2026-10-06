const tap = require('tap')
const Place = require('../../../../model/Place')
const Geometry = require('../../../../model/Geometry')
const map = require('./geometries')

// mapper: division theme tests (Point geometries with buffering)
tap.test('mapper: maps point', (t) => {
  let p = new Place()
  map(p, {
    geometry: {
      'type': 'Point',
      'coordinates': [175.93664034887053, -41.2301040032953]
    },
    properties: {
      cartography: {
        prominence: 28
      }
    }
  })

  t.equal(p.geometry.length, 2)
  t.ok(p.geometry[0] instanceof Geometry)
  t.equal(p.geometry[0].geometry.constructor.name.toUpperCase(), 'POINT')
  t.equal(p.geometry[0].role, 'centroid')
  t.ok(p.geometry[1] instanceof Geometry)
  t.equal(p.geometry[1].geometry.constructor.name.toUpperCase(), 'POLYGON')
  t.equal(p.geometry[1].role, 'buffer')
  t.end()
})

tap.test('mapper: buffer size based on prominence', (t) => {
  let p1 = new Place()
  map(p1, {
    geometry: {
      'type': 'Point',
      'coordinates': [175.0, -41.0]
    },
    properties: {
      cartography: {
        prominence: 20
      }
    }
  })

  let p2 = new Place()
  map(p2, {
    geometry: {
      'type': 'Point',
      'coordinates': [175.0, -41.0]
    },
    properties: {
      cartography: {
        prominence: 50
      }
    }
  })

  // higher prominence should result in larger buffer
  t.ok(p1.geometry[1] instanceof Geometry)
  t.ok(p2.geometry[1] instanceof Geometry)
  t.end()
})

tap.test('mapper: default prominence when missing', (t) => {
  let p = new Place()
  map(p, {
    geometry: {
      'type': 'Point',
      'coordinates': [175.0, -41.0]
    },
    properties: {}
  })

  t.equal(p.geometry.length, 2)
  t.ok(p.geometry[0] instanceof Geometry)
  t.equal(p.geometry[0].role, 'centroid')
  t.ok(p.geometry[1] instanceof Geometry)
  t.equal(p.geometry[1].role, 'buffer')
  t.end()
})
