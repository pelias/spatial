const tap = require('tap')
const Place = require('../../../../model/Place')
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
  let p = new Place(fixture.locality.identity, fixture.locality.ontology)
  map(p, {})

  t.equal(p.hierarchy.length, 0)
  t.end()
})
tap.test('mapper: hierarchies array empty', (t) => {
  let p = new Place(fixture.locality.identity, fixture.locality.ontology)
  map(p, { 'wof:hierarchy': [] })

  t.equal(p.hierarchy.length, 0)
  t.end()
})
tap.test('mapper: single hierarchy', (t) => {
  let p = new Place(fixture.locality.identity, fixture.locality.ontology)
  map(p, { 'wof:hierarchy': [
    {
      'continent_id': 102191581,
      'country_id': 85633051,
      'county_id': 102062861,
      'locality_id': 101748453,
      'region_id': 85682381
    }
  ] })

  t.equal(p.hierarchy.length, 1)
  t.equal(p.hierarchy[0].child, fixture.locality.identity)
  t.equal(p.hierarchy[0].parent.source, fixture.locality.identity.source)
  t.equal(p.hierarchy[0].parent.id, '102062861')
  t.equal(p.hierarchy[0].branch, 'wof:0')
  t.end()
})
tap.test('mapper: multiple hierarchies', (t) => {
  let p = new Place(fixture.region.identity, fixture.region.ontology)
  map(p, {
    'wof:hierarchy': [
      {
        'continent_id': 102191581,
        'country_id': 85632685,
        'disputed_id': 1159339547,
        'empire_id': 874393555,
        'region_id': 85688855
      },
      {
        'continent_id': 102191581,
        'country_id': 85633805,
        'disputed_id': 1159339547,
        'region_id': 85688855
      }
    ]
  })

  t.equal(p.hierarchy.length, 2)

  t.equal(p.hierarchy[0].child, fixture.region.identity)
  t.equal(p.hierarchy[0].parent.source, fixture.region.identity.source)
  t.equal(p.hierarchy[0].parent.id, '85632685')
  t.equal(p.hierarchy[0].branch, 'wof:0')

  t.equal(p.hierarchy[1].child, fixture.region.identity)
  t.equal(p.hierarchy[1].parent.source, fixture.region.identity.source)
  t.equal(p.hierarchy[1].parent.id, '85633805')
  t.equal(p.hierarchy[1].branch, 'wof:1')

  t.end()
})
