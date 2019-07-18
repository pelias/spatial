const Place = require('../../../../model/Place')
const map = require('./place')

module.exports.tests = {}

module.exports.tests.mapper = (test) => {
  test('mapper: properties empty', (t) => {
    let place = map({})
    t.equal(place, null)
    t.end()
  })
  test('mapper: maps identity & ontology', (t) => {
    let place = map({
      properties: {
        '@type': 'relation',
        '@id': '100',
        'place': 'village'
      }
    })
    t.true(place instanceof Place)
    t.equal(place.identity.source, 'osm')
    t.equal(place.identity.id, 'relation:100')
    t.equal(place.ontology.class, 'admin')
    t.equal(place.ontology.type, 'village')
    t.end()
  })
  test('mapper: maps identity & unknown ontology', (t) => {
    let place = map({
      properties: {
        '@type': 'relation',
        '@id': '100'
      }
    })
    t.true(place instanceof Place)
    t.equal(place.identity.source, 'osm')
    t.equal(place.identity.id, 'relation:100')
    t.equal(place.ontology.class, 'admin')
    t.equal(place.ontology.type, 'unknown')
    t.end()
  })
  test('mapper: maps geometry', (t) => {
    let place = map({
      properties: {
        '@type': 'relation',
        '@id': '100',
        'place': 'village'
      },
      geometry: require('../../../../test/fixture/geojson.triangle')
    })
    t.true(place instanceof Place)
    t.equal(place.geometry.length, 1)
    t.equal(place.geometry[0].constructor.name.toUpperCase(), 'POLYGON')
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`place: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
