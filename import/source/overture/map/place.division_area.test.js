const tap = require('tap')
const Place = require('../../../../model/Place')
const map = require('./place')

// mapper: division_area theme tests (Polygon geometries, no hierarchies)
tap.test('mapper: maps geometry for division_area theme', t => {
  let place = map({
    id: '1',
    properties: {
      names: { primary: 'Example' },
      subtype: 'locality'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [175.0, -41.0],
          [176.0, -41.0],
          [176.0, -40.0],
          [175.0, -40.0],
          [175.0, -41.0]
        ]
      ]
    }
  })
  t.ok(place instanceof Place)
  t.equal(place.geometry.length, 1)
  t.equal(place.geometry[0].geometry.constructor.name.toUpperCase(), 'POLYGON')
  t.equal(place.geometry[0].role, 'boundary')
  t.end()
})

tap.test('mapper: division_area has no hierarchies', t => {
  let place = map({
    id: '89e73df8-d5ab-4156-9e83-140d1ee694c5',
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [165.0, -48.0],
          [179.0, -48.0],
          [179.0, -34.0],
          [165.0, -34.0],
          [165.0, -48.0]
        ]
      ]
    },
    properties: {
      country: 'NZ',
      subtype: 'country',
      admin_level: 2,
      division_id: '89e73df8-d5ab-4156-9e83-140d1ee694c5',
      names: {
        primary: 'New Zealand',
        common: { en: 'New Zealand', mi: 'Aotearoa' }
      },
      version: 1
    }
  })

  t.ok(place instanceof Place)
  t.equal(place.identity.source, 'overture')
  t.equal(place.identity.id, '89e73df8-d5ab-4156-9e83-140d1ee694c5')

  // has names
  t.ok(place.name.length > 0)

  // has polygon geometry
  t.equal(place.geometry.length, 1)
  t.equal(place.geometry[0].role, 'boundary')

  // NO hierarchies for division_area
  t.equal(place.hierarchy.length, 0)

  // has properties including division_id
  t.ok(place.property.length > 0)

  t.end()
})
