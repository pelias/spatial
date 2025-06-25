const tap = require('tap')
const Place = require('../../../../model/Place')
const map = require('./place')

// mapper
tap.test('mapper: properties empty', t => {
  let place = map({})
  t.equal(place, null)
  t.end()
})

tap.test('mapper: maps identity & ontology', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:name': 'Example',
      'wof:placetype': 'locality'
    }
  })
  t.ok(place instanceof Place)
  t.equal(place.identity.source, 'wof')
  t.equal(place.identity.id, '1')
  t.equal(place.ontology.class, 'admin')
  t.equal(place.ontology.type, 'locality')
  t.end()
})

tap.test('mapper: ontology type - trim & lowercase', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:name': 'Example',
      'wof:placetype': ' \tLocaLity\n'
    }
  })
  t.ok(place instanceof Place)
  t.equal(place.identity.source, 'wof')
  t.equal(place.identity.id, '1')
  t.equal(place.ontology.class, 'admin')
  t.equal(place.ontology.type, 'locality')
  t.end()
})

tap.test('mapper: ontology type - replace spaces with underscores', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:name': 'Example',
      'wof:placetype': ' \tLocaLity  SquAre\n'
    }
  })
  t.ok(place instanceof Place)
  t.equal(place.identity.source, 'wof')
  t.equal(place.identity.id, '1')
  t.equal(place.ontology.class, 'admin')
  t.equal(place.ontology.type, 'locality_square')
  t.end()
})

tap.test('mapper: maps geometry', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:name': 'Example',
      'wof:placetype': 'locality'
    },
    geometry: require('../../../../test/fixture/geojson.triangle')
  })
  t.ok(place instanceof Place)
  t.equal(place.geometry.length, 1)
  t.equal(place.geometry[0].geometry.constructor.name.toUpperCase(), 'POLYGON')
  t.equal(place.geometry[0].role, 'boundary')
  t.end()
})

// invalid
tap.test('invalid: current true', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:placetype': 'locality',
      'wof:name': 'Example',
      'mz:is_current': 1
    }
  })
  t.ok(place instanceof Place)
  t.end()
})

tap.test('invalid: current false', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:placetype': 'locality',
      'wof:name': 'Example',
      'mz:is_current': 0
    }
  })
  t.equal(place, null)
  t.end()
})

tap.test('invalid: deprecated false', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:placetype': 'locality',
      'wof:name': 'Example',
      'edtf:deprecated': ''
    }
  })
  t.ok(place instanceof Place)
  t.end()
})

tap.test('invalid: deprecated true', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:placetype': 'locality',
      'wof:name': 'Example',
      'edtf:deprecated': 'YYYYMMDD'
    }
  })
  t.equal(place, null)
  t.end()
})

tap.test('invalid: superseded false', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:placetype': 'locality',
      'wof:name': 'Example',
      'wof:superseded_by': []
    }
  })
  t.ok(place instanceof Place)
  t.end()
})

tap.test('invalid: superseded true', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:placetype': 'locality',
      'wof:name': 'Example',
      'wof:superseded_by': ['value']
    }
  })
  t.equal(place, null)
  t.end()
})

tap.test('altgeoms: skip alt geometries', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:placetype': 'locality',
      'wof:name': 'Example',
      'src:alt_label': 'value'
    }
  })
  t.equal(place, null)
  t.end()
})

tap.test('name: skip records with empty name', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:placetype': 'locality',
      'wof:name': ' ', // empty string or undefined
      'wof:hierarchy': [{
        'region_id': 1,
        'locality_id': 2
      }]
    }
  })
  t.equal(place, null)
  t.end()
})

tap.test('mapper: filter neighbourhoods with empty hierarchy', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:placetype': 'neighbourhood',
      'wof:name': 'Example',
      'wof:hierarchy': []
    }
  })
  t.equal(place, null)
  t.end()
})

tap.test('mapper: filter neighbourhoods with no locality or localadmin parent', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:placetype': 'neighbourhood',
      'wof:name': 'Example',
      'wof:hierarchy': [{
        'region_id': 1
      }]
    }
  })
  t.equal(place, null)
  t.end()
})

tap.test('mapper: maps neighbourhoods with valid parentage', t => {
  let place = map({
    id: 1,
    properties: {
      'wof:placetype': 'neighbourhood',
      'wof:name': 'Example',
      'wof:hierarchy': [{
        'region_id': 1,
        'locality_id': 2
      }]
    }
  })
  t.ok(place instanceof Place)
  t.equal(place.identity.source, 'wof')
  t.equal(place.identity.id, '1')
  t.equal(place.ontology.class, 'admin')
  t.equal(place.ontology.type, 'neighbourhood')
  t.end()
})
