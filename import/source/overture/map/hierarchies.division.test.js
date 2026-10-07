const tap = require('tap')
const Place = require('../../../../model/Place')
const Hierarchy = require('../../../../model/Hierarchy')
const Identity = require('../../../../model/Identity')
const Ontology = require('../../../../model/Ontology')
const map = require('./hierarchies')

const fixture = {
  locality: {
    identity: new Identity('overture', '5e2ca450-10ff-4c30-8543-4dc8c5fbb56b'),
    ontology: new Ontology('admin', 'locality')
  }
}

// mapper: division theme tests (hierarchies only exist in division theme)
tap.test('mapper: single hierarchy', (t) => {
  const p = new Place(fixture.locality.identity, fixture.locality.ontology)
  map(p, {
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
    ]]
  })

  t.same(p.hierarchy, [
    new Hierarchy(p.identity, new Identity('overture', '89e73df8-d5ab-4156-9e83-140d1ee694c5'), 'hierarchy:0', 0),
    new Hierarchy(p.identity, new Identity('overture', '3ccc1f1a-44e5-4c43-9321-d94f682073c2'), 'hierarchy:0', 1),
    new Hierarchy(p.identity, new Identity('overture', '39bf7d82-141b-4deb-afb4-597c029e51e0'), 'hierarchy:0', 2),
    new Hierarchy(p.identity, new Identity('overture', '5e2ca450-10ff-4c30-8543-4dc8c5fbb56b'), 'hierarchy:0', 3)
  ])
  t.end()
})

tap.test('mapper: skip items without division_id', (t) => {
  const p = new Place(fixture.locality.identity, fixture.locality.ontology)
  map(p, {
    hierarchies: [[
      {
        division_id: '89e73df8-d5ab-4156-9e83-140d1ee694c5',
        subtype: 'country',
        name: 'New Zealand'
      },
      {
        subtype: 'region',
        name: 'Wellington'
      }
    ]]
  })

  t.same(p.hierarchy, [
    new Hierarchy(p.identity, new Identity('overture', '89e73df8-d5ab-4156-9e83-140d1ee694c5'), 'hierarchy:0', 0)
  ])
  t.end()
})

tap.test('mapper: sorts by subtype rank', (t) => {
  const p = new Place(fixture.locality.identity, fixture.locality.ontology)
  map(p, {
    hierarchies: [[
      {
        division_id: '5e2ca450-10ff-4c30-8543-4dc8c5fbb56b',
        subtype: 'locality',
        name: 'Flat Point'
      },
      {
        division_id: '89e73df8-d5ab-4156-9e83-140d1ee694c5',
        subtype: 'country',
        name: 'New Zealand'
      },
      {
        division_id: '39bf7d82-141b-4deb-afb4-597c029e51e0',
        subtype: 'county',
        name: 'Carterton District'
      }
    ]]
  })

  // should be sorted country -> county -> locality
  t.same(p.hierarchy, [
    new Hierarchy(p.identity, new Identity('overture', '89e73df8-d5ab-4156-9e83-140d1ee694c5'), 'hierarchy:0', 0),
    new Hierarchy(p.identity, new Identity('overture', '39bf7d82-141b-4deb-afb4-597c029e51e0'), 'hierarchy:0', 1),
    new Hierarchy(p.identity, new Identity('overture', '5e2ca450-10ff-4c30-8543-4dc8c5fbb56b'), 'hierarchy:0', 2)
  ])
  t.end()
})

tap.test('mapper: multiple hierarchies', (t) => {
  const p = new Place(fixture.locality.identity, fixture.locality.ontology)
  map(p, {
    hierarchies: [
      [
        {
          division_id: '89e73df8-d5ab-4156-9e83-140d1ee694c5',
          subtype: 'country',
          name: 'New Zealand'
        },
        {
          division_id: '3ccc1f1a-44e5-4c43-9321-d94f682073c2',
          subtype: 'region',
          name: 'Wellington'
        }
      ],
      [
        {
          division_id: '89e73df8-d5ab-4156-9e83-140d1ee694c5',
          subtype: 'country',
          name: 'New Zealand'
        },
        {
          division_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
          subtype: 'region',
          name: 'Alternative Region'
        }
      ]
    ]
  })

  t.same(p.hierarchy, [
    new Hierarchy(p.identity, new Identity('overture', '89e73df8-d5ab-4156-9e83-140d1ee694c5'), 'hierarchy:0', 0),
    new Hierarchy(p.identity, new Identity('overture', '3ccc1f1a-44e5-4c43-9321-d94f682073c2'), 'hierarchy:0', 1),
    new Hierarchy(p.identity, new Identity('overture', '89e73df8-d5ab-4156-9e83-140d1ee694c5'), 'hierarchy:1', 0),
    new Hierarchy(p.identity, new Identity('overture', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'), 'hierarchy:1', 1)
  ])
  t.end()
})
