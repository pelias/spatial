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
        'ZCTA5CE10': '90210'
      }
    })
    t.true(place instanceof Place)
    t.equal(place.identity.source, 'uscensus')
    t.equal(place.identity.id, '90210')
    t.equal(place.ontology.class, 'postalcode')
    t.equal(place.ontology.type, 'zcta')
    t.end()
  })
  test('mapper: maps geometry', (t) => {
    let place = map({
      properties: {
        'ZCTA5CE10': '90210'
      },
      geometry: require('../../../../test/fixture/geojson.triangle')
    })
    t.true(place instanceof Place)
    t.equal(place.geometry.length, 1)
    t.equal(place.geometry[0].geometry.constructor.name.toUpperCase(), 'POLYGON')
    t.equal(place.geometry[0].role, 'boundary')
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
