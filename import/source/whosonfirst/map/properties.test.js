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
    map(p, { 'wof:shortcode': 'FOO' })

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
  test('mapper: wof:population', (t) => {
    let p = new Place()
    map(p, { 'wof:population': 1000 })

    t.equals(p.property.length, 2)
    t.equals(p.property[1].key, 'wof:population', 'wof:population')
    t.equals(p.property[1].value, '1000', 'wof:population')
    t.end()
  })
  test('mapper: src:geom', (t) => {
    let p = new Place()
    map(p, { 'src:geom': 'quattroshapes' })

    t.equals(p.property.length, 2)
    t.equals(p.property[1].key, 'src:geom', 'src:geom')
    t.equals(p.property[1].value, 'quattroshapes', 'src:geom')
    t.end()
  })
  test('mapper: do not map arrays', (t) => {
    let p = new Place()
    map(p, { 'wof:array': [ 'value' ] })

    t.equals(p.property.length, 1)
    t.end()
  })
  test('mapper: do not map objects', (t) => {
    let p = new Place()
    map(p, { 'wof:object': { key: 'value' } })

    t.equals(p.property.length, 1)
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
