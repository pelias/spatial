const tap = require('tap')
const Place = require('../../../../model/Place')
const Name = require('../../../../model/Name')
const map = require('./names')

// mapper: general tests
tap.test('mapper: properties empty', (t) => {
  let p = new Place()
  map(p, {})

  t.equal(p.name.length, 0)
  t.end()
})

tap.test('mapper: names empty', (t) => {
  let p = new Place()
  map(p, { names: {} })

  t.equal(p.name.length, 0)
  t.end()
})

tap.test('mapper: primary name only', (t) => {
  let p = new Place()
  map(p, {
    names: {
      primary: 'Flat Point'
    }
  })

  t.equal(p.name.length, 1)
  t.same(p.name[0], new Name('und', 'default', false, 'Flat Point'))
  t.end()
})

tap.test('mapper: common names not an array', (t) => {
  let p = new Place()
  map(p, {
    names: {
      primary: 'Example',
      common: 'not an array'
    }
  })

  t.equal(p.name.length, 1)
  t.same(p.name[0], new Name('und', 'default', false, 'Example'))
  t.end()
})
