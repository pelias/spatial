const tap = require('tap')
const Place = require('../../../../model/Place')
const map = require('./names')

// mapper
tap.test('mapper: names empty', (t) => {
  let p = new Place()
  map(p, {})

  t.equals(p.name.length, 0)
  t.end()
})
tap.test('mapper: names', (t) => {
  let p = new Place()
  map(p, { 'names': ['name1', 'name2'] })

  t.equals(p.name.length, 2)

  t.equals(p.name[0].lang, 'und')
  t.equals(p.name[0].tag, 'default')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'name1')

  t.equals(p.name[1].lang, 'und')
  t.equals(p.name[1].tag, 'default')
  t.equals(p.name[1].abbr, false)
  t.equals(p.name[1].name, 'name2')

  t.end()
})
