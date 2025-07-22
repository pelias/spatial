const tap = require('tap')
const Place = require('../../../../model/Place')
const map = require('./names')

// mapper
tap.test('mapper: properties empty', (t) => {
  let p = new Place()
  map(p, {})

  t.equal(p.name.length, 0)
  t.end()
})
tap.test('mapper: name', (t) => {
  let p = new Place()
  map(p, { 'ZCTA5CE20': ' example1 ' })

  t.equal(p.name.length, 1)
  t.equal(p.name[0].lang, 'und')
  t.equal(p.name[0].tag, 'default')
  t.equal(p.name[0].abbr, false)
  t.equal(p.name[0].name, 'example1')
  t.end()
})
