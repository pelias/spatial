const tap = require('tap')
const Place = require('../../../../model/Place')

const Identity = require('../../../../model/Identity')
const Ontology = require('../../../../model/Ontology')
const map = require('./hierarchies')

const fixture = {
  locality: {
    identity: new Identity('overture', '5e2ca450-10ff-4c30-8543-4dc8c5fbb56b'),
    ontology: new Ontology('admin', 'locality')
  }
}

// mapper: general tests
tap.test('mapper: properties empty', (t) => {
  const p = new Place(fixture.locality.identity, fixture.locality.ontology)
  map(p, {})

  t.equal(p.hierarchy.length, 0)
  t.end()
})

tap.test('mapper: hierarchies array empty', (t) => {
  const p = new Place(fixture.locality.identity, fixture.locality.ontology)
  map(p, { hierarchies: [] })

  t.equal(p.hierarchy.length, 0)
  t.end()
})
