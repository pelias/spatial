const tap = require('tap')
const TermQuery = require('./TermQuery')

// constructor
tap.test('constructor: empty', (t) => {
  let q = new TermQuery()
  t.equals(q.text, '')
  t.deepEquals(q.settings, {})
  t.end()
})
tap.test('constructor: text only', (t) => {
  let q = new TermQuery('text')
  t.equals(q.text, 'text')
  t.deepEquals(q.settings, {})
  t.end()
})
tap.test('constructor: settings only', (t) => {
  let q = new TermQuery(undefined, { foo: 'foo' })
  t.equals(q.text, '')
  t.deepEquals(q.settings, { foo: 'foo' })
  t.end()
})
tap.test('constructor: text and settings', (t) => {
  let q = new TermQuery('text', { foo: 'foo' })
  t.equals(q.text, 'text')
  t.deepEquals(q.settings, { foo: 'foo' })
  t.end()
})

// toString
tap.test('toString - empty', (t) => {
  let q = new TermQuery()
  t.equals(q.toString(), '')
  t.end()
})
tap.test('toString - empty', (t) => {
  let q = new TermQuery('\n\t \t\n')
  t.equals(q.toString(), '')
  t.end()
})
tap.test('toString - no wildcards', (t) => {
  let q = new TermQuery('example query', { wildcard: { start: false, end: false } })
  t.equals(q.toString(), 'example query')
  t.end()
})
tap.test('toString - both wildcards', (t) => {
  let q = new TermQuery('example query', { wildcard: { start: true, end: true } })
  t.equals(q.toString(), '%example query%')
  t.end()
})
tap.test('toString - wildcard start only', (t) => {
  let q = new TermQuery('example query', { wildcard: { start: true, end: false } })
  t.equals(q.toString(), '%example query')
  t.end()
})
tap.test('toString - wildcard end only', (t) => {
  let q = new TermQuery('example query', { wildcard: { start: false, end: true } })
  t.equals(q.toString(), 'example query%')
  t.end()
})
