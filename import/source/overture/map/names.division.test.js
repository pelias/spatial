const tap = require('tap')
const Place = require('../../../../model/Place')
const Name = require('../../../../model/Name')
const map = require('./names')

// mapper: division theme tests
tap.test('mapper: primary and common names', (t) => {
  let p = new Place()
  map(p, {
    names: {
      primary: 'Tīnui',
      common: {
        en: 'Tīnui',
        mi: 'Tīnui'
      }
    }
  })

  t.equal(p.name.length, 3)
  t.same(p.name[0], new Name('und', 'default', false, 'Tīnui'))
  // Object iteration order may vary
  const variants = p.name.slice(1)
  t.ok(variants.some(n => n.lang === 'en' && n.name === 'Tīnui'))
  t.ok(variants.some(n => n.lang === 'mi' && n.name === 'Tīnui'))
  // common names that match primary ARE added when they have specific language codes
  t.end()
})

tap.test('mapper: primary and different common names', (t) => {
  let p = new Place()
  map(p, {
    names: {
      primary: 'New Zealand',
      common: {
        en: 'New Zealand',
        mi: 'Aotearoa',
        fr: 'Nouvelle-Zélande'
      }
    }
  })

  t.equal(p.name.length, 4)
  t.same(p.name[0], new Name('und', 'default', false, 'New Zealand'))
  // Object iteration order may vary
  const variants = p.name.slice(1)
  t.ok(variants.some(n => n.lang === 'en' && n.name === 'New Zealand'))
  t.ok(variants.some(n => n.lang === 'mi' && n.name === 'Aotearoa'))
  t.ok(variants.some(n => n.lang === 'fr' && n.name === 'Nouvelle-Zélande'))
  t.end()
})

tap.test('mapper: skip invalid common names', (t) => {
  let p = new Place()
  map(p, {
    names: {
      primary: 'Example',
      common: {
        en: 'Valid Name',
        de: '' // empty value should be skipped
      }
    }
  })

  t.equal(p.name.length, 2)
  t.same(p.name[0], new Name('und', 'default', false, 'Example'))
  t.same(p.name[1], new Name('en', 'variant', false, 'Valid Name'))
  t.end()
})

tap.test('mapper: default language for missing lang', (t) => {
  let p = new Place()
  map(p, {
    names: {
      primary: 'Example',
      common: {
        '': 'Name Without Lang',
        und: 'Another Name'
      }
    }
  })

  t.equal(p.name.length, 3)
  t.same(p.name[0], new Name('und', 'default', false, 'Example'))
  // Object iteration order may vary
  const variants = p.name.slice(1)
  t.ok(variants.some(n => n.lang === 'und' && n.name === 'Name Without Lang'))
  t.ok(variants.some(n => n.lang === 'und' && n.name === 'Another Name'))
  t.end()
})
