const tap = require('tap')
const Place = require('../../../../model/Place')
const Geometry = require('../../../../model/Geometry')
const map = require('./geometries')

// mapper: division_area theme tests (Polygon/MultiPolygon geometries)
tap.test('mapper: maps polygon', (t) => {
  let p = new Place()
  map(p, {
    geometry: {
      'type': 'Polygon',
      'coordinates': [
        [
          [175.0, -41.0],
          [176.0, -41.0],
          [176.0, -40.0],
          [175.0, -40.0],
          [175.0, -41.0]
        ]
      ]
    }
  })

  t.equal(p.geometry.length, 1)
  t.ok(p.geometry[0] instanceof Geometry)
  t.equal(p.geometry[0].geometry.constructor.name.toUpperCase(), 'POLYGON')
  t.equal(p.geometry[0].role, 'boundary')
  t.end()
})

tap.test('mapper: maps multipolygon', (t) => {
  let p = new Place()
  map(p, {
    geometry: {
      'type': 'MultiPolygon',
      'coordinates': [
        [
          [
            [175.0, -41.0],
            [176.0, -41.0],
            [176.0, -40.0],
            [175.0, -40.0],
            [175.0, -41.0]
          ]
        ]
      ]
    }
  })

  t.equal(p.geometry.length, 1)
  t.ok(p.geometry[0] instanceof Geometry)
  t.equal(p.geometry[0].geometry.constructor.name.toUpperCase(), 'MULTIPOLYGON')
  t.equal(p.geometry[0].role, 'boundary')
  t.end()
})
