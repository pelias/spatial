const tap = require('tap')
const Place = require('../../../../model/Place')
const Geometry = require('../../../../model/Geometry')
const map = require('./geometries')

// mapper
tap.test('mapper: geometry empty', (t) => {
  let p = new Place()
  map(p, {})

  t.equal(p.geometry.length, 0)
  t.end()
})
tap.test('mapper: maps linestring', (t) => {
  let p = new Place()
  map(p, {
    geometry: {
      'type': 'LineString',
      'coordinates': [
        [
          174.887496,
          -37.805985
        ],
        [
          174.887435,
          -37.805939
        ],
        [
          174.887207,
          -37.805798
        ]
      ]
    }
  })
  t.equal(p.geometry.length, 1)
  t.ok(p.geometry[0] instanceof Geometry)
  t.equal(p.geometry[0].geometry.constructor.name.toUpperCase(), 'LINESTRING')
  t.equal(p.geometry[0].role, 'centerline')
  t.end()
})
