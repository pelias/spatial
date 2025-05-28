const tap = require('tap')
const Place = require('../../../../model/Place')
const map = require('./properties')

// mapper
tap.test('mapper: properties empty', (t) => {
  let p = new Place()
  map(p, {})

  t.equal(p.property.length, 1)
  t.equal(p.property[0].key, 'alpha2', 'default property')
  t.equal(p.property[0].value, 'XX', 'default property')
  t.end()
})
tap.test('mapper: alpha2', (t) => {
  let p = new Place()
  map(p, { 'wof:country': 'us' })

  t.equal(p.property.length, 1)
  t.equal(p.property[0].key, 'alpha2', 'alpha2')
  t.equal(p.property[0].value, 'US', 'alpha2')
  t.end()
})
tap.test('mapper: alpha3', (t) => {
  let p = new Place()
  map(p, { 'wof:country_alpha3': 'usa' })

  t.equal(p.property.length, 2)
  t.equal(p.property[1].key, 'alpha3', 'alpha3')
  t.equal(p.property[1].value, 'USA', 'alpha3')
  t.end()
})
tap.test('mapper: modified', (t) => {
  let p = new Place()
  map(p, { 'wof:lastmodified': 1561745825 })

  t.equal(p.property.length, 2)
  t.equal(p.property[1].key, 'modified', 'modified')
  t.equal(p.property[1].value, '1561745825', 'modified')
  t.end()
})
tap.test('mapper: wof:shortcode', (t) => {
  let p = new Place()
  map(p, { 'wof:shortcode': 'FOO' })

  t.equal(p.property.length, 2)
  t.equal(p.property[1].key, 'wof:shortcode', 'wof:shortcode')
  t.equal(p.property[1].value, 'FOO', 'wof:shortcode')
  t.end()
})
tap.test('mapper: wof:repo', (t) => {
  let p = new Place()
  map(p, { 'wof:repo': 'example' })

  t.equal(p.property.length, 2)
  t.equal(p.property[1].key, 'wof:repo', 'wof:repo')
  t.equal(p.property[1].value, 'example', 'wof:repo')
  t.end()
})
tap.test('mapper: wof:population', (t) => {
  let p = new Place()
  map(p, { 'wof:population': 1000 })

  t.equal(p.property.length, 2)
  t.equal(p.property[1].key, 'wof:population', 'wof:population')
  t.equal(p.property[1].value, '1000', 'wof:population')
  t.end()
})
tap.test('mapper: src:geom', (t) => {
  let p = new Place()
  map(p, { 'src:geom': 'quattroshapes' })

  t.equal(p.property.length, 2)
  t.equal(p.property[1].key, 'src:geom', 'src:geom')
  t.equal(p.property[1].value, 'quattroshapes', 'src:geom')
  t.end()
})
tap.test('mapper: do not map arrays', (t) => {
  let p = new Place()
  map(p, { 'wof:array': [ 'value' ] })

  t.equal(p.property.length, 1)
  t.end()
})
tap.test('mapper: do not map objects', (t) => {
  let p = new Place()
  map(p, { 'wof:object': { key: 'value' } })
  t.equal(p.property.length, 1)
  t.end()
})
tap.test('mapper: do not map objects', (t) => {
  let p = new Place()
  map(p, { 'wof:object': { key: 'value' } })

  t.equal(p.property.length, 1)
  t.end()
})
tap.test('mapper: array lang_x_spoken', (t) => {
  let p = new Place()
  map(p, { 'wof:lang_x_spoken': ['deu', '', null, 'eng'] })

  t.equal(p.property.length, 2)
  t.equal(p.property[0].key, 'alpha2', 'alpha2')
  t.equal(p.property[1].key, 'wof:lang_x_spoken', 'wof:lang_x_spoken')
  t.equal(p.property[1].value, 'deu,eng', 'wof:lang_x_spoken')
  t.end()
})
tap.test('mapper: array lang_x_official', (t) => {
  let p = new Place()
  map(p, { 'wof:lang_x_official': ['deu', '', undefined, 'eng'] })

  t.equal(p.property.length, 2)
  t.equal(p.property[0].key, 'alpha2', 'alpha2')
  t.equal(p.property[1].key, 'wof:lang_x_official', 'wof:lang_x_official')
  t.equal(p.property[1].value, 'deu,eng', 'wof:lang_x_official')
  t.end()
})
