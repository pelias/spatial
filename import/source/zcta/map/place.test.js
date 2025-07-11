const tap = require('tap')
const Place = require('../../../../model/Place')
const map = require('./place')

// mapper
tap.test('mapper: properties empty', (t) => {
  let place = map({})
  t.equal(place, null)
  t.end()
})
tap.test('mapper: maps identity & ontology', (t) => {
  let place = map({
    properties: {
      'ZCTA5CE20': '90210'
    }
  })
  t.ok(place instanceof Place)
  t.equal(place.identity.source, 'uscensus')
  t.equal(place.identity.id, 'zcta:90210')
  t.equal(place.ontology.class, 'admin')
  t.equal(place.ontology.type, 'postalcode')
  t.end()
})
tap.test('mapper: maps geometry', (t) => {
  let place = map({
    properties: {
      'ZCTA5CE20': '90210'
    },
    geometry: require('../../../../test/fixture/geojson.triangle')
  })
  t.ok(place instanceof Place)
  t.equal(place.geometry.length, 1)
  t.equal(place.geometry[0].geometry.constructor.name.toUpperCase(), 'POLYGON')
  t.equal(place.geometry[0].role, 'boundary')
  t.end()
})
