const tap = require('tap')
const Identity = require('./Identity')

// constructor
tap.test('constructor: empty', (t) => {
  let i = new Identity()
  t.equals(i.source, undefined)
  t.equals(i.id, undefined)
  t.end()
})
tap.test('constructor: source only', (t) => {
  let i = new Identity('source')
  t.equals(i.source, 'source')
  t.equals(i.id, undefined)
  t.end()
})
tap.test('constructor: id only', (t) => {
  let i = new Identity(undefined, 'id')
  t.equals(i.source, undefined)
  t.equals(i.id, 'id')
  t.end()
})
tap.test('constructor: source and id', (t) => {
  let i = new Identity('source', 'id')
  t.equals(i.source, 'source')
  t.equals(i.id, 'id')
  t.end()
})

// setSource
tap.test('setSource: undefined', (t) => {
  let i = new Identity()
  i.setSource(undefined)
  t.equals(i.source, undefined)
  t.end()
})
tap.test('setSource: array', (t) => {
  let i = new Identity()
  i.setSource([])
  t.equals(i.source, undefined)
  t.end()
})
tap.test('setSource: object', (t) => {
  let i = new Identity()
  i.setSource({})
  t.equals(i.source, undefined)
  t.end()
})
tap.test('setSource: nil object', (t) => {
  let i = new Identity()
  i.setSource(null)
  t.equals(i.source, undefined)
  t.end()
})
tap.test('setSource: number', (t) => {
  let i = new Identity()
  i.setSource(1)
  t.equals(i.source, undefined)
  t.end()
})
tap.test('setSource: nil number', (t) => {
  let i = new Identity()
  i.setSource(NaN)
  t.equals(i.source, undefined)
  t.end()
})
tap.test('setSource: string', (t) => {
  let i = new Identity()
  i.setSource('test')
  t.equals(i.source, 'test')
  t.end()
})
tap.test('setSource: nil string', (t) => {
  let i = new Identity()
  i.setSource('')
  t.equals(i.source, '')
  t.end()
})

// setId
tap.test('setId: undefined', (t) => {
  let i = new Identity()
  i.setId(undefined)
  t.equals(i.id, undefined)
  t.end()
})
tap.test('setId: array', (t) => {
  let i = new Identity()
  i.setId([])
  t.equals(i.id, undefined)
  t.end()
})
tap.test('setId: object', (t) => {
  let i = new Identity()
  i.setId({})
  t.equals(i.id, undefined)
  t.end()
})
tap.test('setId: nil object', (t) => {
  let i = new Identity()
  i.setId(null)
  t.equals(i.id, undefined)
  t.end()
})
tap.test('setId: number', (t) => {
  let i = new Identity()
  i.setId(1)
  t.equals(i.id, undefined)
  t.end()
})
tap.test('setId: nil number', (t) => {
  let i = new Identity()
  i.setId(NaN)
  t.equals(i.id, undefined)
  t.end()
})
tap.test('setId: string', (t) => {
  let i = new Identity()
  i.setId('test')
  t.equals(i.id, 'test')
  t.end()
})
tap.test('setId: nil string', (t) => {
  let i = new Identity()
  i.setId('')
  t.equals(i.id, '')
  t.end()
})

// isValid
tap.test('isValid: empty', (t) => {
  let i = new Identity()
  t.false(i._isValid())
  t.end()
})
tap.test('isValid: source only', (t) => {
  let i = new Identity('source')
  t.false(i._isValid())
  t.end()
})
tap.test('isValid: id only', (t) => {
  let i = new Identity(undefined, 'id')
  t.false(i._isValid())
  t.end()
})
tap.test('isValid: empty source and id', (t) => {
  let i = new Identity('', 'id')
  t.false(i._isValid())
  t.end()
})
tap.test('isValid: source and empty id', (t) => {
  let i = new Identity('source', '')
  t.false(i._isValid())
  t.end()
})
tap.test('isValid: source and id', (t) => {
  let i = new Identity('source', 'id')
  t.true(i._isValid())
  t.end()
})
