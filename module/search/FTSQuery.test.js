const tap = require('tap')
const FTSQuery = require('./FTSQuery')

// constructor
tap.test('constructor: empty', (t) => {
  let q = new FTSQuery()
  t.equal(q.text, '')
  t.same(q.settings, {})
  t.end()
})
tap.test('constructor: text only', (t) => {
  let q = new FTSQuery('text')
  t.equal(q.text, 'text')
  t.same(q.settings, {})
  t.end()
})
tap.test('constructor: settings only', (t) => {
  let q = new FTSQuery(undefined, { foo: 'foo' })
  t.equal(q.text, '')
  t.same(q.settings, { foo: 'foo' })
  t.end()
})
tap.test('constructor: text and settings', (t) => {
  let q = new FTSQuery('text', { foo: 'foo' })
  t.equal(q.text, 'text')
  t.same(q.settings, { foo: 'foo' })
  t.end()
})

// toString
tap.test('toString - empty', (t) => {
  let q = new FTSQuery()
  t.equal(q.toString(), '')
  t.end()
})
tap.test('toString - empty', (t) => {
  let q = new FTSQuery('\n\t \t\n')
  t.equal(q.toString(), '')
  t.end()
})
tap.test('toString - quoted', (t) => {
  let q = new FTSQuery('example query')
  t.equal(q.toString(), '^ "example query"')
  t.end()
})
tap.test('toString - no wildcards', (t) => {
  let q = new FTSQuery('example query', { wildcard: { start: false, end: false } })
  t.equal(q.toString(), '^ "example query"')
  t.end()
})
tap.test('toString - both wildcards', (t) => {
  let q = new FTSQuery('example query', { wildcard: { start: true, end: true } })
  t.equal(q.toString(), '"example query" *')
  t.end()
})
tap.test('toString - wildcard start only', (t) => {
  let q = new FTSQuery('example query', { wildcard: { start: true, end: false } })
  t.equal(q.toString(), '"example query"')
  t.end()
})
tap.test('toString - wildcard end only', (t) => {
  let q = new FTSQuery('example query', { wildcard: { start: false, end: true } })
  t.equal(q.toString(), '^ "example query" *')
  t.end()
})
