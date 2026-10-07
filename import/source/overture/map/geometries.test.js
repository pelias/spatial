const tap = require('tap')
const Place = require('../../../../model/Place')

const map = require('./geometries')

// mapper: general tests
tap.test('mapper: geometry empty', (t) => {
  let p = new Place()
  map(p, {})

  t.equal(p.geometry.length, 0)
  t.end()
})
