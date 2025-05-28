const tap = require('tap')
const Place = require('../../../../model/Place')
const map = require('./properties')

// mapper
tap.test('mapper: properties empty', (t) => {
  let p = new Place()
  map(p, {})

  t.equal(p.property.length, 1)
  t.equal(p.property[0].key, 'alpha2', 'default property')
  t.equal(p.property[0].value, 'XX', 'default property')
  t.end()
})
tap.test('mapper: alpha2', (t) => {
  let p = new Place()
  map(p, { 'ISO3166-1:alpha2': 'us' })

  t.equal(p.property.length, 1)
  t.equal(p.property[0].key, 'alpha2', 'alpha2')
  t.equal(p.property[0].value, 'US', 'alpha2')
  t.end()
})
tap.test('mapper: alpha2 - ISO3166-2', (t) => {
  let p = new Place()
  map(p, { 'ISO3166-2': 'us-foo' })

  t.equal(p.property.length, 2)
  t.equal(p.property[0].key, 'alpha2_region', 'alpha2_region')
  t.equal(p.property[0].value, 'FOO', 'alpha2_region')
  t.equal(p.property[1].key, 'alpha2', 'alpha2')
  t.equal(p.property[1].value, 'US', 'alpha2')
  t.end()
})
tap.test('mapper: alpha3', (t) => {
  let p = new Place()
  map(p, { 'ISO3166-1:alpha3': 'usa' })

  t.equal(p.property.length, 2)
  t.equal(p.property[1].key, 'alpha3', 'alpha3')
  t.equal(p.property[1].value, 'USA', 'alpha3')
  t.end()
})
tap.test('mapper: osm-specific', (t) => {
  let p = new Place()
  map(p, { '@foo': 'filtered', 'bar': 'bar', 'baz': 'baz', 'name': 'name' })

  t.equal(p.property.length, 3)
  t.equal(p.property[1].key, 'osm:bar', 'osm:bar')
  t.equal(p.property[1].value, 'bar', 'osm:bar')
  t.equal(p.property[2].key, 'osm:baz', 'osm:baz')
  t.equal(p.property[2].value, 'baz', 'osm:baz')
  t.end()
})
tap.test('mapper: osm-specific - multivalue', (t) => {
  let p = new Place()
  map(p, { '@foo': 'filtered', 'bar': 'bar; abar', 'baz': 'baz; abaz', 'name': 'name' })

  t.equal(p.property.length, 3)
  t.equal(p.property[1].key, 'osm:bar', 'osm:bar')
  t.equal(p.property[1].value, 'bar; abar', 'osm:bar')
  t.equal(p.property[2].key, 'osm:baz', 'osm:baz')
  t.equal(p.property[2].value, 'baz; abaz', 'osm:baz')
  t.end()
})
