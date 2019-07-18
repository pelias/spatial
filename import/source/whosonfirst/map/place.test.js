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
      id: 1,
      properties: {
        'wof:placetype': 'locality'
      }
    })
    t.true(place instanceof Place)
    t.equal(place.identity.source, 'wof')
    t.equal(place.identity.id, '1')
    t.equal(place.ontology.class, 'admin')
    t.equal(place.ontology.type, 'locality')
    t.end()
  })
  test('mapper: maps geometry', (t) => {
    let place = map({
      id: 1,
      properties: {
        'wof:placetype': 'locality'
      },
      geometry: require('../../../../test/fixture/geojson.triangle')
    })
    t.true(place instanceof Place)
    t.equal(place.geometry.length, 1)
    t.equal(place.geometry[0].constructor.name.toUpperCase(), 'POLYGON')
    t.end()
  })
}

module.exports.tests.invalid = (test) => {
  test('invalid: current true', (t) => {
    let place = map({
      id: 1,
      properties: {
        'wof:placetype': 'locality',
        'mz:is_current': 1
      }
    })
    t.true(place instanceof Place)
    t.end()
  })
  test('invalid: current false', (t) => {
    let place = map({
      id: 1,
      properties: {
        'wof:placetype': 'locality',
        'mz:is_current': 0
      }
    })
    t.equal(place, null)
    t.end()
  })
  test('invalid: deprecated false', (t) => {
    let place = map({
      id: 1,
      properties: {
        'wof:placetype': 'locality',
        'edtf:deprecated': ''
      }
    })
    t.true(place instanceof Place)
    t.end()
  })
  test('invalid: deprecated true', (t) => {
    let place = map({
      id: 1,
      properties: {
        'wof:placetype': 'locality',
        'edtf:deprecated': 'YYYYMMDD'
      }
    })
    t.equal(place, null)
    t.end()
  })
  test('invalid: superseded false', (t) => {
    let place = map({
      id: 1,
      properties: {
        'wof:placetype': 'locality',
        'wof:superseded_by': []
      }
    })
    t.true(place instanceof Place)
    t.end()
  })
  test('invalid: superseded true', (t) => {
    let place = map({
      id: 1,
      properties: {
        'wof:placetype': 'locality',
        'wof:superseded_by': ['value']
      }
    })
    t.equal(place, null)
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
