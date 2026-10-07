const tap = require('tap')
const Place = require('../../../../model/Place')
const map = require('./place')

// mapper: general tests
tap.test('mapper: properties empty', t => {
  let place = map({})
  t.equal(place, null)
  t.end()
})

tap.test('mapper: no id', t => {
  let place = map({
    properties: {
      names: { primary: 'Example' },
      subtype: 'locality'
    }
  })
  t.equal(place, null)
  t.end()
})

tap.test('mapper: no primary name', t => {
  let place = map({
    id: '5e2ca450-10ff-4c30-8543-4dc8c5fbb56b',
    properties: {
      subtype: 'locality'
    }
  })
  t.equal(place, null)
  t.end()
})

tap.test('mapper: empty primary name', t => {
  let place = map({
    id: '5e2ca450-10ff-4c30-8543-4dc8c5fbb56b',
    properties: {
      names: { primary: '  ' },
      subtype: 'locality'
    }
  })
  t.equal(place, null)
  t.end()
})

tap.test('mapper: maps identity & ontology', t => {
  let place = map({
    id: '5e2ca450-10ff-4c30-8543-4dc8c5fbb56b',
    properties: {
      names: { primary: 'Flat Point' },
      subtype: 'locality'
    }
  })
  t.ok(place instanceof Place)
  t.equal(place.identity.source, 'overture')
  t.equal(place.identity.id, '5e2ca450-10ff-4c30-8543-4dc8c5fbb56b')
  t.equal(place.ontology.class, 'admin')
  t.equal(place.ontology.type, 'locality')
  t.end()
})

tap.test('mapper: default subtype to unknown', t => {
  let place = map({
    id: '1',
    properties: {
      names: { primary: 'Example' }
    }
  })
  t.ok(place instanceof Place)
  t.equal(place.ontology.type, 'unknown')
  t.end()
})

tap.test('mapper: numeric id converted to string', t => {
  let place = map({
    id: 123456,
    properties: {
      names: { primary: 'Example' },
      subtype: 'locality'
    }
  })
  t.ok(place instanceof Place)
  t.equal(place.identity.id, '123456')
  t.end()
})

tap.test('mapper: properties not an object', t => {
  let place = map({
    id: '1',
    properties: 'invalid'
  })
  t.equal(place, null)
  t.end()
})
