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

  t.equal(p.hierarchy.length, 1)
  t.equal(p.hierarchy[0].child, fixture.locality.identity)
  t.equal(p.hierarchy[0].parent.source, fixture.locality.identity.source)
  t.equal(p.hierarchy[0].parent.id, '102062861')
  t.equal(p.hierarchy[0].branch, 'wof:0')
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

  t.equal(p.hierarchy.length, 2)

  t.equal(p.hierarchy[0].child, fixture.region.identity)
  t.equal(p.hierarchy[0].parent.source, fixture.region.identity.source)
  t.equal(p.hierarchy[0].parent.id, '1159339547')
  t.equal(p.hierarchy[0].branch, 'wof:0')

  t.equal(p.hierarchy[1].child, fixture.region.identity)
  t.equal(p.hierarchy[1].parent.source, fixture.region.identity.source)
  t.equal(p.hierarchy[1].parent.id, '1159339547')
  t.equal(p.hierarchy[1].branch, 'wof:1')

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

  t.equal(p.hierarchy.length, 1)
  t.same(p.hierarchy, [
    new Hierarchy(
      new Identity('wof', '1729339019'),
      new Identity('wof', '1729238583'),
      'wof:0'
    )
  ])
  t.end()
})
