const tap = require('tap')
const Place = require('../../../../model/Place')
const Property = require('../../../../model/Property')
const map = require('./properties')

// mapper: general tests
tap.test('mapper: properties empty', (t) => {
  let p = new Place()
  map(p, {})

  t.equal(p.property.length, 0)
  t.end()
})

tap.test('mapper: country', (t) => {
  let p = new Place()
  map(p, { country: 'nz' })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('alpha2', 'NZ'))
  t.end()
})

tap.test('mapper: subtype', (t) => {
  let p = new Place()
  map(p, { subtype: 'locality' })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('subtype', 'locality'))
  t.end()
})

tap.test('mapper: class', (t) => {
  let p = new Place()
  map(p, { class: 'city' })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('class', 'city'))
  t.end()
})

tap.test('mapper: version', (t) => {
  let p = new Place()
  map(p, { version: 4 })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('version', '4'))
  t.end()
})

tap.test('mapper: local_type', (t) => {
  let p = new Place()
  map(p, {
    local_type: [
      ['en', 'locality'],
      ['mi', 'kāinga']
    ]
  })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('local_type', 'en:locality,mi:kāinga'))
  t.end()
})

tap.test('mapper: local_type invalid entries', (t) => {
  let p = new Place()
  map(p, {
    local_type: [
      ['en', 'locality'],
      'invalid',
      ['fr']
    ]
  })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('local_type', 'en:locality'))
  t.end()
})

tap.test('mapper: sources', (t) => {
  let p = new Place()
  map(p, {
    sources: [{
      provider: 'linz',
      dataset: 'Linz',
      license: 'CC-BY-4.0',
      record_id: '2592',
      resource: 'linz_suburb_locality_major_name',
      update_time: '2026-08-12T00:00:00Z'
    }]
  })

  t.equal(p.property.length, 6)
  t.same(p.property[0], new Property('source_provider', 'linz'))
  t.same(p.property[1], new Property('source_dataset', 'Linz'))
  t.same(p.property[2], new Property('source_record_id', '2592'))
  t.same(p.property[3], new Property('source_resource', 'linz_suburb_locality_major_name'))
  t.same(p.property[4], new Property('source_license', 'CC-BY-4.0'))
  t.same(p.property[5], new Property('source_update_time', '2026-08-12T00:00:00Z'))
  t.end()
})

tap.test('mapper: sources with minimal fields', (t) => {
  let p = new Place()
  map(p, {
    sources: [{
      provider: 'osm',
      dataset: 'OpenStreetMap'
    }]
  })

  t.equal(p.property.length, 2)
  t.same(p.property[0], new Property('source_provider', 'osm'))
  t.same(p.property[1], new Property('source_dataset', 'OpenStreetMap'))
  t.end()
})

tap.test('mapper: skip null or undefined values', (t) => {
  let p = new Place()
  map(p, {
    country: 'NZ',
    region: null,
    subtype: undefined,
    population: 0
  })

  // country should be added, population should be '0'
  t.equal(p.property.length, 2)
  t.same(p.property[0], new Property('alpha2', 'NZ'))
  t.same(p.property[1], new Property('population', '0'))
  t.end()
})
