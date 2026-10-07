const tap = require('tap')
const Place = require('../../../../model/Place')
const map = require('./place')

// mapper: division theme tests (Point geometries with hierarchies)
tap.test('mapper: maps all components for division theme', t => {
  let place = map({
    id: '5e2ca450-10ff-4c30-8543-4dc8c5fbb56b',
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [175.93664034887053, -41.2301040032953]
    },
    properties: {
      country: 'NZ',
      subtype: 'locality',
      class: 'city',
      names: {
        primary: 'Flat Point',
        common: { en: 'Flat Point' }
      },
      region: 'NZ-WGN',
      hierarchies: [[
        {
          division_id: '89e73df8-d5ab-4156-9e83-140d1ee694c5',
          subtype: 'country',
          name: 'New Zealand'
        },
        {
          division_id: '3ccc1f1a-44e5-4c43-9321-d94f682073c2',
          subtype: 'region',
          name: 'Wellington'
        },
        {
          division_id: '39bf7d82-141b-4deb-afb4-597c029e51e0',
          subtype: 'county',
          name: 'Carterton District'
        },
        {
          division_id: '5e2ca450-10ff-4c30-8543-4dc8c5fbb56b',
          subtype: 'locality',
          name: 'Flat Point'
        }
      ]],
      parent_division_id: '39bf7d82-141b-4deb-afb4-597c029e51e0',
      population: 39,
      cartography: {
        prominence: 28
      },
      version: 3
    }
  })

  t.ok(place instanceof Place)
  t.equal(place.identity.source, 'overture')
  t.equal(place.identity.id, '5e2ca450-10ff-4c30-8543-4dc8c5fbb56b')
  t.equal(place.ontology.class, 'admin')
  t.equal(place.ontology.type, 'locality')

  // has names
  t.ok(place.name.length > 0)

  // has geometries (point + buffer)
  t.equal(place.geometry.length, 2)

  // has hierarchies
  t.equal(place.hierarchy.length, 4)

  // has properties
  t.ok(place.property.length > 0)

  t.end()
})
