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
    map(p, { 'ZCTA5CE10': ' example1 ' })

    t.equals(p.name.length, 1)
    t.equals(p.name[0].lang, 'und')
    t.equals(p.name[0].tag, 'default')
    t.equals(p.name[0].abbr, false)
    t.equals(p.name[0].name, 'example1')
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
