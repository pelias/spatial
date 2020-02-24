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
tap.test('mapper: name', (t) => {
  let p = new Place()
  map(p, { 'name': 'example1' })

  t.equals(p.name.length, 1)
  t.equals(p.name[0].lang, 'und')
  t.equals(p.name[0].tag, 'default')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'example1')
  t.end()
})
tap.test('mapper: from place_name tag', (t) => {
  let p = new Place()
  map(p, { 'place_name': 'example1' })

  t.equals(p.name.length, 1)
  t.equals(p.name[0].lang, 'und')
  t.equals(p.name[0].tag, 'default')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'example1')
  t.end()
})
tap.test('mapper: from postal_code tag', (t) => {
  let p = new Place()
  map(p, { 'boundary': 'postal_code', 'postal_code': 'example1' })

  t.equals(p.name.length, 1)
  t.equals(p.name[0].lang, 'und')
  t.equals(p.name[0].tag, 'default')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'example1')
  t.end()
})
tap.test('mapper: use postal_code tag even when name is available', (t) => {
  let p = new Place()
  map(p, { 'place_name': 'example1', 'boundary': 'postal_code', 'postal_code': 'example2' })

  t.equals(p.name.length, 1)
  t.equals(p.name[0].lang, 'und')
  t.equals(p.name[0].tag, 'default')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'example2')
  t.end()
})
tap.test('mapper: name - multivalue', (t) => {
  let p = new Place()
  map(p, { 'name': 'example1; example2' })

  t.equals(p.name.length, 1)
  t.equals(p.name[0].lang, 'und')
  t.equals(p.name[0].tag, 'default')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'example1')
  t.end()
})
tap.test('mapper: name:lang', (t) => {
  let p = new Place()
  map(p, { 'name:en': 'example1' })

  t.equals(p.name.length, 1)
  t.equals(p.name[0].lang, 'eng')
  t.equals(p.name[0].tag, 'preferred')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'example1')
  t.end()
})
tap.test('mapper: name:lang - multivalue', (t) => {
  let p = new Place()
  map(p, { 'name:en': 'example1; example2' })

  t.equals(p.name.length, 1)
  t.equals(p.name[0].lang, 'eng')
  t.equals(p.name[0].tag, 'preferred')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'example1')
  t.end()
})
tap.test('mapper: alt_name:lang', (t) => {
  let p = new Place()
  map(p, { 'alt_name:de': 'example2' })

  t.equals(p.name.length, 1)
  t.equals(p.name[0].lang, 'deu')
  t.equals(p.name[0].tag, 'alt')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'example2')
  t.end()
})
tap.test('mapper: short_name:lang', (t) => {
  let p = new Place()
  map(p, { 'short_name:de': 'example2' })

  t.equals(p.name.length, 1)
  t.equals(p.name[0].lang, 'deu')
  t.equals(p.name[0].tag, 'short')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'example2')
  t.end()
})
tap.test('mapper: official_name:lang', (t) => {
  let p = new Place()
  map(p, { 'official_name:de': 'example2' })

  t.equals(p.name.length, 1)
  t.equals(p.name[0].lang, 'deu')
  t.equals(p.name[0].tag, 'official')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'example2')
  t.end()
})
tap.test('mapper: old_name:lang', (t) => {
  let p = new Place()
  map(p, { 'old_name:de': 'example2' })

  t.equals(p.name.length, 1)
  t.equals(p.name[0].lang, 'deu')
  t.equals(p.name[0].tag, 'old')
  t.equals(p.name[0].abbr, false)
  t.equals(p.name[0].name, 'example2')
  t.end()
})
