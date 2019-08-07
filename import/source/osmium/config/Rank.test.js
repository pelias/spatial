const Place = require('../../../../model/Place')
const Rank = require('./Rank')

module.exports.tests = {}

module.exports.tests.constructor = (test) => {
  test('constructor: defaults', (t) => {
    let r = new Rank()
    t.equal(r.search, 30, 'default')
    t.equal(r.address, 0, 'default')
    t.end()
  })
}

module.exports.tests.infer = (test) => {
  test('infer: undefined place', (t) => {
    let r = new Rank()
    r.infer(undefined, {})
    t.equal(r.search, 30, 'default')
    t.equal(r.address, 0, 'default')
    t.end()
  })
  test('infer: undefined properties', (t) => {
    let r = new Rank()
    r.infer(new Place(), undefined)
    t.equal(r.search, 30, 'default')
    t.equal(r.address, 0, 'default')
    t.end()
  })
  test('infer: empty properties', (t) => {
    let r = new Rank()
    r.infer(new Place(), {})
    t.equal(r.search, 30, 'default')
    t.equal(r.address, 0, 'default')
    t.end()
  })
  test('infer: place - ranks as array', (t) => {
    let r = new Rank()
    r.infer(new Place(), { 'place': 'town' })
    t.equal(r.search, 18)
    t.equal(r.address, 16)
    t.end()
  })
  test('infer: place - ranks as scalar', (t) => {
    let r = new Rank()
    r.infer(new Place(), { 'place': 'city' })
    t.equal(r.search, 16)
    t.equal(r.address, 16)
    t.end()
  })
  test('infer: boundary - no admin_level', (t) => {
    let r = new Rank()
    r.infer(new Place(), { 'boundary': 'administrative' })
    t.equal(r.search, 30, 'default')
    t.equal(r.address, 0, 'default')
    t.end()
  })
  test('infer: boundary - with admin_level', (t) => {
    let r = new Rank()
    r.infer(new Place(), { 'boundary': 'administrative', 'admin_level': 6 })
    t.equal(r.search, 12)
    t.equal(r.address, 12)
    t.end()
  })
  test('infer: landuse', (t) => {
    let r = new Rank()
    r.infer(new Place(), { 'landuse': 'residential' })
    t.equal(r.search, 22)
    t.equal(r.address, 22)
    t.end()
  })
  test('infer: landuse - empty value', (t) => {
    let r = new Rank()
    r.infer(new Place(), { 'landuse': '' })
    t.equal(r.search, 22)
    t.equal(r.address, 0)
    t.end()
  })
  test('infer: leisure', (t) => {
    let r = new Rank()
    r.infer(new Place(), { 'leisure': 'park' })
    t.equal(r.search, 24)
    t.equal(r.address, 0)
    t.end()
  })
  test('infer: natural', (t) => {
    let r = new Rank()
    r.infer(new Place(), { 'natural': 'volcano' })
    t.equal(r.search, 18)
    t.equal(r.address, 0)
    t.end()
  })
  test('infer: waterway', (t) => {
    let r = new Rank()
    r.infer(new Place(), { 'waterway': '' })
    t.equal(r.search, 17)
    t.equal(r.address, 0)
    t.end()
  })
  test('infer: highway', (t) => {
    let r = new Rank()
    r.infer(new Place(), { 'highway': 'footway' })
    t.equal(r.search, 27)
    t.equal(r.address, 27)
    t.end()
  })
  test('infer: mountain_pass', (t) => {
    let r = new Rank()
    r.infer(new Place(), { 'mountain_pass': '' })
    t.equal(r.search, 20)
    t.equal(r.address, 0)
    t.end()
  })
  test('infer: historic', (t) => {
    let r = new Rank()
    r.infer(new Place(), { 'historic': 'neighbourhood' })
    t.equal(r.search, 30)
    t.equal(r.address, 0)
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`rank: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
