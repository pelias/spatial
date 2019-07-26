const Place = require('../../../../model/Place')
const map = require('./names')

module.exports.tests = {}

module.exports.tests.mapper = (test) => {
  test('mapper: properties empty', (t) => {
    let p = new Place()
    map(p, {})

    t.equals(p.name.length, 0)
    t.end()
  })
  test('mapper: name', (t) => {
    let p = new Place()
    map(p, { 'name': 'example1' })

    t.equals(p.name.length, 1)
    t.equals(p.name[0].lang, 'und')
    t.equals(p.name[0].tag, 'default')
    t.equals(p.name[0].abbr, false)
    t.equals(p.name[0].name, 'example1')
    t.end()
  })
  test('mapper: name - multivalue', (t) => {
    let p = new Place()
    map(p, { 'name': 'example1; example2' })

    t.equals(p.name.length, 1)
    t.equals(p.name[0].lang, 'und')
    t.equals(p.name[0].tag, 'default')
    t.equals(p.name[0].abbr, false)
    t.equals(p.name[0].name, 'example1')
    t.end()
  })
  test('mapper: name:lang', (t) => {
    let p = new Place()
    map(p, { 'name:en': 'example1' })

    t.equals(p.name.length, 1)
    t.equals(p.name[0].lang, 'eng')
    t.equals(p.name[0].tag, 'preferred')
    t.equals(p.name[0].abbr, false)
    t.equals(p.name[0].name, 'example1')
    t.end()
  })
  test('mapper: name:lang - multivalue', (t) => {
    let p = new Place()
    map(p, { 'name:en': 'example1; example2' })

    t.equals(p.name.length, 1)
    t.equals(p.name[0].lang, 'eng')
    t.equals(p.name[0].tag, 'preferred')
    t.equals(p.name[0].abbr, false)
    t.equals(p.name[0].name, 'example1')
    t.end()
  })
  test('mapper: alt_name:lang', (t) => {
    let p = new Place()
    map(p, { 'alt_name:de': 'example2' })

    t.equals(p.name.length, 1)
    t.equals(p.name[0].lang, 'deu')
    t.equals(p.name[0].tag, 'alt')
    t.equals(p.name[0].abbr, false)
    t.equals(p.name[0].name, 'example2')
    t.end()
  })
  test('mapper: short_name:lang', (t) => {
    let p = new Place()
    map(p, { 'short_name:de': 'example2' })

    t.equals(p.name.length, 1)
    t.equals(p.name[0].lang, 'deu')
    t.equals(p.name[0].tag, 'short')
    t.equals(p.name[0].abbr, false)
    t.equals(p.name[0].name, 'example2')
    t.end()
  })
  test('mapper: official_name:lang', (t) => {
    let p = new Place()
    map(p, { 'official_name:de': 'example2' })

    t.equals(p.name.length, 1)
    t.equals(p.name[0].lang, 'deu')
    t.equals(p.name[0].tag, 'official')
    t.equals(p.name[0].abbr, false)
    t.equals(p.name[0].name, 'example2')
    t.end()
  })
  test('mapper: old_name:lang', (t) => {
    let p = new Place()
    map(p, { 'old_name:de': 'example2' })

    t.equals(p.name.length, 1)
    t.equals(p.name[0].lang, 'deu')
    t.equals(p.name[0].tag, 'old')
    t.equals(p.name[0].abbr, false)
    t.equals(p.name[0].name, 'example2')
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`names: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
