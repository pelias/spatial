const tap = require('tap')
const Place = require('../../../../model/Place')
const map = require('./names')

// mapper
tap.test('mapper: properties empty', (t) => {
  let p = new Place()
  map(p, {})

  t.equals(p.name.length, 0)
  t.end()
})
tap.test('mapper: wof:name', (t) => {
  let p = new Place()
  map(p, { 'wof:name': 'example1' })

  t.equals(p.name.length, 1)
  t.equals(p.name[0].lang, 'und')
  t.equals(p.name[0].tag, 'default')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'example1')
  t.end()
})
tap.test('mapper: wof:abbreviation', (t) => {
  let p = new Place()
  map(p, { 'wof:abbreviation': 'example1' })

  t.equals(p.name.length, 1)
  t.equals(p.name[0].lang, 'und')
  t.equals(p.name[0].tag, 'default')
  t.equals(p.name[0].abbr, true)
  t.equals(p.name[0].name, 'example1')
  t.end()
})
tap.test('mapper: name', (t) => {
  let p = new Place()
  map(p, { 'name:eng_x_preferred': [ 'example1', 'example2' ] })

  t.equals(p.name.length, 2)

  t.equals(p.name[0].lang, 'eng')
  t.equals(p.name[0].tag, 'preferred')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'example1')

  t.equals(p.name[1].lang, 'eng')
  t.equals(p.name[1].tag, 'preferred')
  t.equals(p.name[1].abbr, false)
  t.equals(p.name[1].name, 'example2')
  t.end()
})
tap.test('mapper: abbreviation', (t) => {
  let p = new Place()
  map(p, { 'abrv:eng_x_preferred': [ 'example1', 'example2' ] })

  t.equals(p.name.length, 2)

  t.equals(p.name[0].lang, 'eng')
  t.equals(p.name[0].tag, 'preferred')
  t.equals(p.name[0].abbr, true)
  t.equals(p.name[0].name, 'example1')

  t.equals(p.name[1].lang, 'eng')
  t.equals(p.name[1].tag, 'preferred')
  t.equals(p.name[1].abbr, true)
  t.equals(p.name[1].name, 'example2')
  t.end()
})
