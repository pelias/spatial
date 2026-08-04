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

// generic name
tap.test('mapper: wof:name - prefer wof:label over wof:name', (t) => {
  let p = new Place()
  map(p, {
    'wof:label': 'example1',
    'wof:name': 'example2',
    'qs:a2_alt': 'example3'
  })

  t.equal(p.name.length, 1)
  t.equal(p.name[0].lang, 'und')
  t.equal(p.name[0].tag, 'default')
  t.equal(p.name[0].abbr, false)
  t.equal(p.name[0].name, 'example1')
  t.end()
})
tap.test('mapper: wof:name - use wof:name when wof:label unset', (t) => {
  let p = new Place()
  map(p, {
    'wof:name': 'example2',
    'qs:a2_alt': 'example3'
  })

  t.equal(p.name.length, 1)
  t.equal(p.name[0].lang, 'und')
  t.equal(p.name[0].tag, 'default')
  t.equal(p.name[0].abbr, false)
  t.equal(p.name[0].name, 'example2')
  t.end()
})
tap.test('mapper: wof:name - use qs:a2_alt for USA counties', (t) => {
  let p = new Place()
  map(p, {
    'iso:country': 'US',
    'wof:placetype': 'county',
    'wof:label': 'example1',
    'wof:name': 'example2',
    'qs:a2_alt': 'example3'
  })

  t.equal(p.name.length, 1)
  t.equal(p.name[0].lang, 'und')
  t.equal(p.name[0].tag, 'default')
  t.equal(p.name[0].abbr, false)
  t.equal(p.name[0].name, 'example3')
  t.end()
})
tap.test('mapper: wof:name - label:eng_x_preferred_longname wins over qs:a2_alt for USA counties', (t) => {
  let p = new Place()
  map(p, {
    'iso:country': 'US',
    'wof:placetype': 'county',
    'wof:name': 'Kings',
    'label:eng_x_preferred_longname': ['Kings County'],
    'qs:a2_alt': 'a different qs:a2_alt value'
  })

  t.equal(p.name.length, 1)
  t.equal(p.name[0].name, 'Kings County')
  t.end()
})
tap.test('mapper: wof:name - longname is used for French counties', (t) => {
  let p = new Place()
  map(p, {
    'iso:country': 'FR',
    'wof:placetype': 'county',
    'wof:name': 'Montmarault',
    'label:eng_x_preferred_longname': ['Montmarault Canton']
  })

  t.equal(p.name.length, 1)
  t.equal(p.name[0].name, 'Montmarault Canton')
  t.end()
})
tap.test('mapper: wof:name - longname is NOT used outside the qualifier-preferred allowlist ' +
  '(eg. Greater London stays Greater London, not the ceremonial-county longname)', (t) => {
  let p = new Place()
  map(p, {
    'iso:country': 'GB',
    'wof:placetype': 'macrocounty',
    'wof:name': 'Greater London',
    'label:eng_x_preferred_longname': ['Greater London Ceremonial County']
  })

  t.equal(p.name.length, 1)
  t.equal(p.name[0].name, 'Greater London')
  t.end()
})

// generic abbreviation
tap.test('mapper: wof:abbreviation - prefer wof:shortcode over wof:abbreviation', (t) => {
  let p = new Place()
  map(p, {
    'wof:country_alpha3': 'example1',
    'wof:shortcode': 'example2',
    'wof:abbreviation': 'example3',
    'wof:country': 'example4'
  })

  t.equal(p.name.length, 1)
  t.equal(p.name[0].lang, 'und')
  t.equal(p.name[0].tag, 'default')
  t.equal(p.name[0].abbr, true)
  t.equal(p.name[0].name, 'example2')
  t.end()
})
tap.test('mapper: wof:abbreviation - use wof:abbreviation when wof:shortcode unset', (t) => {
  let p = new Place()
  map(p, {
    'wof:country_alpha3': 'example1',
    'wof:abbreviation': 'example3',
    'wof:country': 'example4'
  })

  t.equal(p.name.length, 1)
  t.equal(p.name[0].lang, 'und')
  t.equal(p.name[0].tag, 'default')
  t.equal(p.name[0].abbr, true)
  t.equal(p.name[0].name, 'example3')
  t.end()
})
tap.test('mapper: wof:abbreviation - prefer country_alpha3 for country placetype', (t) => {
  let p = new Place()
  map(p, {
    'wof:placetype': 'country',
    'wof:country_alpha3': 'example1',
    'wof:shortcode': 'example2',
    'wof:abbreviation': 'example3',
    'wof:country': 'example4'
  })

  t.equal(p.name.length, 1)
  t.equal(p.name[0].lang, 'und')
  t.equal(p.name[0].tag, 'default')
  t.equal(p.name[0].abbr, true)
  t.equal(p.name[0].name, 'example1')
  t.end()
})
tap.test('mapper: wof:abbreviation - use wof:country as last resort for dependency placetype', (t) => {
  let p = new Place()
  map(p, {
    'wof:placetype': 'dependency',
    'wof:country': 'example4'
  })

  t.equal(p.name.length, 1)
  t.equal(p.name[0].lang, 'und')
  t.equal(p.name[0].tag, 'default')
  t.equal(p.name[0].abbr, true)
  t.equal(p.name[0].name, 'example4')
  t.end()
})

tap.test('mapper: name', (t) => {
  let p = new Place()
  map(p, { 'name:eng_x_preferred': [ 'example1', 'example2' ] })

  t.equal(p.name.length, 2)

  t.equal(p.name[0].lang, 'eng')
  t.equal(p.name[0].tag, 'preferred')
  t.equal(p.name[0].abbr, false)
  t.equal(p.name[0].name, 'example1')

  t.equal(p.name[1].lang, 'eng')
  t.equal(p.name[1].tag, 'preferred')
  t.equal(p.name[1].abbr, false)
  t.equal(p.name[1].name, 'example2')
  t.end()
})
tap.test('mapper: abbreviation', (t) => {
  let p = new Place()
  map(p, { 'abrv:eng_x_preferred': [ 'example1', 'example2' ] })

  t.equal(p.name.length, 2)

  t.equal(p.name[0].lang, 'eng')
  t.equal(p.name[0].tag, 'preferred')
  t.equal(p.name[0].abbr, true)
  t.equal(p.name[0].name, 'example1')

  t.equal(p.name[1].lang, 'eng')
  t.equal(p.name[1].tag, 'preferred')
  t.equal(p.name[1].abbr, true)
  t.equal(p.name[1].name, 'example2')
  t.end()
})
