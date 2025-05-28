const tap = require('tap')
const Place = require('../../../../model/Place')
const map = require('./place')

// mapper
tap.test('mapper: properties empty', (t) => {
  let place = map({})
  t.equal(place, null)
  t.end()
})
tap.test('mapper: no names', (t) => {
  let place = map({ properties: { names: [] } })
  t.equal(place, null)
  t.end()
})
tap.test('mapper: default ontology type', (t) => {
  let place = map({
    properties: {
      'id': 'exampleID',
      'names': ['exampleName']
    }
  })
  t.ok(place instanceof Place)
  t.equal(place.identity.source, '0sv')
  t.equal(place.identity.id, 'exampleID')
  t.equal(place.ontology.class, 'street')
  t.equal(place.ontology.type, 'unknown')
  t.end()
})
tap.test('mapper: maps identity & ontology', (t) => {
  let place = map({
    properties: {
      'id': 'exampleID',
      'ontology': { 'type': 'exampleType' },
      'names': ['exampleName']
    }
  })
  t.ok(place instanceof Place)
  t.equal(place.identity.source, '0sv')
  t.equal(place.identity.id, 'exampleID')
  t.equal(place.ontology.class, 'street')
  t.equal(place.ontology.type, 'exampletype')
  t.end()
})
