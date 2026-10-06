const tap = require('tap')
const Place = require('../../../../model/Place')
const Property = require('../../../../model/Property')
const map = require('./properties')

// mapper: division theme tests
tap.test('mapper: region', (t) => {
  let p = new Place()
  map(p, { region: 'NZ-WGN' })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('region', 'NZ-WGN'))
  t.end()
})

tap.test('mapper: population', (t) => {
  let p = new Place()
  map(p, { population: 1249 })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('population', '1249'))
  t.end()
})

tap.test('mapper: prominence', (t) => {
  let p = new Place()
  map(p, { cartography: { prominence: 41 } })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('prominence', '41'))
  t.end()
})

tap.test('mapper: parent_division_id', (t) => {
  let p = new Place()
  map(p, { parent_division_id: 'c771219a-2dbd-4404-a30e-777ae28ef949' })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('parent_division_id', 'c771219a-2dbd-4404-a30e-777ae28ef949'))
  t.end()
})

tap.test('mapper: cartography min_zoom', (t) => {
  let p = new Place()
  map(p, { cartography: { min_zoom: 8 } })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('min_zoom', '8'))
  t.end()
})

tap.test('mapper: cartography max_zoom', (t) => {
  let p = new Place()
  map(p, { cartography: { max_zoom: 12 } })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('max_zoom', '12'))
  t.end()
})

tap.test('mapper: cartography sort_key', (t) => {
  let p = new Place()
  map(p, { cartography: { sort_key: 100 } })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('sort_key', '100'))
  t.end()
})

tap.test('mapper: multiple division properties', (t) => {
  let p = new Place()
  map(p, {
    country: 'NZ',
    region: 'NZ-WGN',
    subtype: 'locality',
    class: 'city',
    population: 39,
    cartography: { prominence: 28 },
    version: 3
  })

  t.equal(p.property.length, 7)
  t.end()
})
