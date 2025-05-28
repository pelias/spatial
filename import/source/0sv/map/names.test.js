const tap = require('tap')
const Place = require('../../../../model/Place')
const map = require('./names')

// mapper
tap.test('mapper: names empty', (t) => {
  let p = new Place()
  map(p, {})

  t.equal(p.name.length, 0)
  t.end()
})
tap.test('mapper: names', (t) => {
  let p = new Place()
  map(p, { 'names': ['name1', 'name2'] })

  t.equal(p.name.length, 2)

  t.equal(p.name[0].lang, 'und')
  t.equal(p.name[0].tag, 'default')
  t.equal(p.name[0].abbr, false)
  t.equal(p.name[0].name, 'name1')

  t.equal(p.name[1].lang, 'und')
  t.equal(p.name[1].tag, 'default')
  t.equal(p.name[1].abbr, false)
  t.equal(p.name[1].name, 'name2')

  t.end()
})
