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
    map(p, { 'wof:country': 'us' })

    t.equals(p.property.length, 1)
    t.equals(p.property[0].key, 'alpha2', 'alpha2')
    t.equals(p.property[0].value, 'US', 'alpha2')
    t.end()
  })
  test('mapper: alpha3', (t) => {
    let p = new Place()
    map(p, { 'wof:country_alpha3': 'usa' })

    t.equals(p.property.length, 2)
    t.equals(p.property[1].key, 'alpha3', 'alpha3')
    t.equals(p.property[1].value, 'USA', 'alpha3')
    t.end()
  })
  test('mapper: name', (t) => {
    let p = new Place()
    map(p, { 'wof:name': 'example' })

    t.equals(p.property.length, 2)
    t.equals(p.property[1].key, 'name', 'name')
    t.equals(p.property[1].value, 'example', 'name')
    t.end()
  })
  test('mapper: abbr', (t) => {
    let p = new Place()
    map(p, { 'wof:abbreviation': 'example' })

    t.equals(p.property.length, 2)
    t.equals(p.property[1].key, 'abbr', 'abbr')
    t.equals(p.property[1].value, 'example', 'abbr')
    t.end()
  })
  test('mapper: modified', (t) => {
    let p = new Place()
    map(p, { 'wof:lastmodified': 1561745825 })

    t.equals(p.property.length, 2)
    t.equals(p.property[1].key, 'modified', 'modified')
    t.equals(p.property[1].value, '1561745825', 'modified')
    t.end()
  })
  test('mapper: wof:shortcode', (t) => {
    let p = new Place()
    map(p, { 'wof:shortcode': 'foo' })

    t.equals(p.property.length, 2)
    t.equals(p.property[1].key, 'wof:shortcode', 'wof:shortcode')
    t.equals(p.property[1].value, 'FOO', 'wof:shortcode')
    t.end()
  })
  test('mapper: wof:repo', (t) => {
    let p = new Place()
    map(p, { 'wof:repo': 'example' })

    t.equals(p.property.length, 2)
    t.equals(p.property[1].key, 'wof:repo', 'wof:repo')
    t.equals(p.property[1].value, 'example', 'wof:repo')
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
