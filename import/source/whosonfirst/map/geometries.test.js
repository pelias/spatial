const Place = require('../../../../model/Place')
const Geometry = require('../../../../model/Geometry')
const map = require('./geometries')

module.exports.tests = {}

module.exports.tests.mapper = (test) => {
  test('mapper: geometry empty', (t) => {
    let p = new Place()
    map(p, {})

    t.equals(p.geometry.length, 0)
    t.end()
  })
  test('mapper: maps polygon', (t) => {
    let p = new Place()
    map(p, {
      geometry: {
        'type': 'Polygon',
        'coordinates': [
          [
            [
              39.0234375,
              48.922499263758255
            ],
            [
              47.8125,
              39.639537564366684
            ],
            [
              61.17187499999999,
              49.83798245308484
            ],
            [
              39.0234375,
              48.922499263758255
            ]
          ]
        ]
      }
    })
    t.equals(p.geometry.length, 1)
    t.true(p.geometry[0] instanceof Geometry)
    t.equal(p.geometry[0].geometry.constructor.name.toUpperCase(), 'POLYGON')
    t.equal(p.geometry[0].role, 'boundary')
    t.end()
  })
  test('mapper: maps point', (t) => {
    let p = new Place()
    map(p, {
      geometry: {
        'type': 'Point',
        'coordinates': [
          59.0625,
          47.989921667414194
        ]
      }
    })
    t.equals(p.geometry.length, 2)
    t.true(p.geometry[0] instanceof Geometry)
    t.equal(p.geometry[0].geometry.constructor.name.toUpperCase(), 'POINT')
    t.equal(p.geometry[0].role, 'centroid')
    t.true(p.geometry[1] instanceof Geometry)
    t.equal(p.geometry[1].geometry.constructor.name.toUpperCase(), 'POLYGON')
    t.equal(p.geometry[1].role, 'boundary')
    t.end()
  })
  test('mapper: label position', (t) => {
    let p = new Place()
    map(p, {
      geometry: {
        'type': 'Polygon',
        'coordinates': [
          [
            [
              39.0234375,
              48.922499263758255
            ],
            [
              47.8125,
              39.639537564366684
            ],
            [
              61.17187499999999,
              49.83798245308484
            ],
            [
              39.0234375,
              48.922499263758255
            ]
          ]
        ]
      },
      properties: {
        'lbl:longitude': 1.1,
        'lbl:latitude': 2.2
      }
    })
    t.equals(p.geometry.length, 2)
    t.true(p.geometry[1] instanceof Geometry)
    t.equal(p.geometry[1].geometry.constructor.name.toUpperCase(), 'POINT')
    t.equal(p.geometry[1].role, 'label_position')
    t.end()
  })

  test('mapper: mapshaper position', (t) => {
    let p = new Place()
    map(p, {
      geometry: {
        'type': 'Polygon',
        'coordinates': [
          [
            [
              39.0234375,
              48.922499263758255
            ],
            [
              47.8125,
              39.639537564366684
            ],
            [
              61.17187499999999,
              49.83798245308484
            ],
            [
              39.0234375,
              48.922499263758255
            ]
          ]
        ]
      },
      properties: {
        'mps:longitude': 1.1,
        'mps:latitude': 2.2
      }
    })
    t.equals(p.geometry.length, 2)
    t.true(p.geometry[1] instanceof Geometry)
    t.equal(p.geometry[1].geometry.constructor.name.toUpperCase(), 'POINT')
    t.equal(p.geometry[1].role, 'mapshaper_position')
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`geometries: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
