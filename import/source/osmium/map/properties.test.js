const Place = require('../../../../model/Place')
const map = require('./properties')

module.exports.tests = {}

module.exports.tests.mapper = (test) => {
  test('mapper: properties empty', (t) => {
    let p = new Place()
    map(p, {})

    t.equals(p.property.length, 1)
    t.equals(p.property[0].key, 'alpha2', 'default property')
    t.equals(p.property[0].value, 'XX', 'default property')
    t.end()
  })
  test('mapper: alpha2', (t) => {
    let p = new Place()
    map(p, { 'ISO3166-1:alpha2': 'us' })

    t.equals(p.property.length, 1)
    t.equals(p.property[0].key, 'alpha2', 'alpha2')
    t.equals(p.property[0].value, 'US', 'alpha2')
    t.end()
  })
  test('mapper: alpha2 - ISO3166-2', (t) => {
    let p = new Place()
    map(p, { 'ISO3166-2': 'us-foo' })

    t.equals(p.property.length, 2)
    t.equals(p.property[0].key, 'alpha2_region', 'alpha2_region')
    t.equals(p.property[0].value, 'FOO', 'alpha2_region')
    t.equals(p.property[1].key, 'alpha2', 'alpha2')
    t.equals(p.property[1].value, 'US', 'alpha2')
    t.end()
  })
  test('mapper: alpha3', (t) => {
    let p = new Place()
    map(p, { 'ISO3166-1:alpha3': 'usa' })

    t.equals(p.property.length, 2)
    t.equals(p.property[1].key, 'alpha3', 'alpha3')
    t.equals(p.property[1].value, 'USA', 'alpha3')
    t.end()
  })
  test('mapper: osm-specific', (t) => {
    let p = new Place()
    map(p, { '@foo': 'filtered', 'bar': 'bar', 'baz': 'baz', 'name': 'name' })

    t.equals(p.property.length, 3)
    t.equals(p.property[1].key, 'osm:bar', 'osm:bar')
    t.equals(p.property[1].value, 'bar', 'osm:bar')
    t.equals(p.property[2].key, 'osm:baz', 'osm:baz')
    t.equals(p.property[2].value, 'baz', 'osm:baz')
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`properties: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
