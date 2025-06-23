const tap = require('tap')
const Place = require('../../../../model/Place')
const Hierarchy = require('../../../../model/Hierarchy')
const Identity = require('../../../../model/Identity')
const Ontology = require('../../../../model/Ontology')
const map = require('./hierarchies')

const fixture = {
  locality: {
    identity: new Identity('wof', '101748453'),
    ontology: new Ontology('admin', 'locality')
  },
  region: {
    identity: new Identity('wof', '85688855'),
    ontology: new Ontology('admin', 'region')
  }
}

// mapper
tap.test('mapper: properties empty', (t) => {
  const p = new Place(fixture.locality.identity, fixture.locality.ontology)
  map(p, {})

  t.equal(p.hierarchy.length, 0)
  t.end()
})
tap.test('mapper: hierarchies array empty', (t) => {
  const p = new Place(fixture.locality.identity, fixture.locality.ontology)
  map(p, { 'wof:hierarchy': [] })

  t.equal(p.hierarchy.length, 0)
  t.end()
})
tap.test('mapper: single hierarchy', (t) => {
  const p = new Place(fixture.locality.identity, fixture.locality.ontology)
  map(p, {
    'wof:hierarchy': [
      {
        continent_id: 102191581,
        country_id: 85633051,
        county_id: 102062861,
        locality_id: 101748453,
        region_id: 85682381
      }
    ]
  })

  t.same([
    new Hierarchy(p.identity, p.identity, 'wof:0', 0),
    new Hierarchy(p.identity, new Identity('wof', '102062861'), 'wof:0', 1),
    new Hierarchy(p.identity, new Identity('wof', '85682381'), 'wof:0', 2),
    new Hierarchy(p.identity, new Identity('wof', '85633051'), 'wof:0', 3),
    new Hierarchy(p.identity, new Identity('wof', '102191581'), 'wof:0', 4)
  ], p.hierarchy)
  t.end()
})
tap.test('mapper: multiple hierarchies', (t) => {
  const p = new Place(fixture.region.identity, fixture.region.ontology)
  map(p, {
    'wof:hierarchy': [
      {
        continent_id: 102191581,
        country_id: 85632685,
        disputed_id: 1159339547,
        empire_id: 874393555,
        region_id: 85688855
      },
      {
        continent_id: 102191581,
        country_id: 85633805,
        disputed_id: 1159339547,
        region_id: 85688855
      }
    ]
  })

  t.same([
    new Hierarchy(p.identity, p.identity, 'wof:0', 0),
    new Hierarchy(p.identity, new Identity('wof', '1159339547'), 'wof:0', 1),
    new Hierarchy(p.identity, new Identity('wof', '85632685'), 'wof:0', 2),
    new Hierarchy(p.identity, new Identity('wof', '874393555'), 'wof:0', 3),
    new Hierarchy(p.identity, new Identity('wof', '102191581'), 'wof:0', 4),

    new Hierarchy(p.identity, p.identity, 'wof:1', 0),
    new Hierarchy(p.identity, new Identity('wof', '1159339547'), 'wof:1', 1),
    new Hierarchy(p.identity, new Identity('wof', '85633805'), 'wof:1', 2),
    new Hierarchy(p.identity, new Identity('wof', '102191581'), 'wof:1', 3)
  ], p.hierarchy)

  t.end()
})
tap.test('mapper: skip -1 ids', (t) => {
  const p = new Place(fixture.region.identity, fixture.region.ontology)
  map(p, {
    'wof:hierarchy': [
      {
        continent_id: 102191581,
        country_id: -1,
        disputed_id: 1159339547,
        empire_id: 874393555,
        region_id: 85688855
      }
    ]
  })

  t.same([
    new Hierarchy(p.identity, p.identity, 'wof:0', 0),
    new Hierarchy(p.identity, new Identity('wof', '1159339547'), 'wof:0', 1),
    new Hierarchy(p.identity, new Identity('wof', '874393555'), 'wof:0', 2),
    new Hierarchy(p.identity, new Identity('wof', '102191581'), 'wof:0', 3)
  ], p.hierarchy)

  t.end()
})
tap.test('mapper: key ordering', (t) => {
  const p = new Place(new Identity('wof', '1729339019'), new Ontology('admin', 'locality'))
  map(p, {
    'wof:hierarchy': [
      {
        continent_id: 102191583,
        country_id: 85633345,
        county_id: 102079339,
        localadmin_id: 1729238583,
        locality_id: 1729339019,
        region_id: 85687233
      }
    ]
  })

  t.same([
    new Hierarchy(p.identity, p.identity, 'wof:0', 0),
    new Hierarchy(p.identity, new Identity('wof', '1729238583'), 'wof:0', 1),
    new Hierarchy(p.identity, new Identity('wof', '102079339'), 'wof:0', 2),
    new Hierarchy(p.identity, new Identity('wof', '85687233'), 'wof:0', 3),
    new Hierarchy(p.identity, new Identity('wof', '85633345'), 'wof:0', 4),
    new Hierarchy(p.identity, new Identity('wof', '102191583'), 'wof:0', 5)
  ], p.hierarchy)

  t.end()
})
tap.test('mapper: sort hierarchy - unknown placetype', (t) => {
  const p = new Place(new Identity('wof', '1729339019'), new Ontology('admin', 'locality'))
  map(p, {
    'wof:hierarchy': [
      {
        region_id: 85687233,
        unknown_id: 1
      }
    ]
  })

  t.same([
    new Hierarchy(p.identity, p.identity, 'wof:0', 0),
    new Hierarchy(p.identity, new Identity('wof', '85687233'), 'wof:0', 1),
    new Hierarchy(p.identity, new Identity('wof', '1'), 'wof:0', 2)
  ], p.hierarchy)

  t.end()
})
