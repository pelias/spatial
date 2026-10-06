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
      common: [
        ['en', 'Tīnui'],
        ['mi', 'Tīnui']
      ]
    }
  })

  t.equal(p.name.length, 3)
  t.same(p.name[0], new Name('und', 'default', false, 'Tīnui'))
  t.same(p.name[1], new Name('en', 'variant', false, 'Tīnui'))
  t.same(p.name[2], new Name('mi', 'variant', false, 'Tīnui'))
  // common names that match primary ARE added when they have specific language codes
  t.end()
})

tap.test('mapper: primary and different common names', (t) => {
  let p = new Place()
  map(p, {
    names: {
      primary: 'New Zealand',
      common: [
        ['en', 'New Zealand'],
        ['mi', 'Aotearoa'],
        ['fr', 'Nouvelle-Zélande']
      ]
    }
  })

  t.equal(p.name.length, 4)
  t.same(p.name[0], new Name('und', 'default', false, 'New Zealand'))
  t.same(p.name[1], new Name('en', 'variant', false, 'New Zealand'))
  t.same(p.name[2], new Name('mi', 'variant', false, 'Aotearoa'))
  t.same(p.name[3], new Name('fr', 'variant', false, 'Nouvelle-Zélande'))
  t.end()
})

tap.test('mapper: skip invalid common names', (t) => {
  let p = new Place()
  map(p, {
    names: {
      primary: 'Example',
      common: [
        ['en', 'Valid Name'],
        'invalid',
        ['en'],
        null,
        ['de', '']
      ]
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
      common: [
        ['', 'Name Without Lang'],
        [null, 'Another Name']
      ]
    }
  })

  t.equal(p.name.length, 3)
  t.same(p.name[0], new Name('und', 'default', false, 'Example'))
  t.same(p.name[1], new Name('und', 'variant', false, 'Name Without Lang'))
  t.same(p.name[2], new Name('und', 'variant', false, 'Another Name'))
  t.end()
})
