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

tap.test('mapper: common names not an object', (t) => {
  let p = new Place()
  map(p, {
    names: {
      primary: 'Example',
      common: 'not an object'
    }
  })

  t.equal(p.name.length, 1)
  t.same(p.name[0], new Name('und', 'default', false, 'Example'))
  t.end()
})

tap.test('mapper: common names', (t) => {
  let p = new Place()
  map(p, {
    names: {
      primary: 'Amundsen–Scott South Pole',
      common: {
        lkt: 'Itókaǧata Phíŋkpa',
        ko: '아문센-스콧 남극점 기지',
        es: 'Base Amundsen-Scott',
        en: 'Amundsen–Scott South Pole Station'
      }
    }
  })

  t.equal(p.name.length, 5)
  t.same(p.name[0], new Name('und', 'default', false, 'Amundsen–Scott South Pole'))
  // Note: object iteration order may vary, so we check all expected names are present
  const variants = p.name.slice(1)
  t.ok(variants.some(n => n.lang === 'lkt' && n.name === 'Itókaǧata Phíŋkpa'))
  t.ok(variants.some(n => n.lang === 'ko' && n.name === '아문센-스콧 남극점 기지'))
  t.ok(variants.some(n => n.lang === 'es' && n.name === 'Base Amundsen-Scott'))
  t.ok(variants.some(n => n.lang === 'en' && n.name === 'Amundsen–Scott South Pole Station'))
  t.end()
})
