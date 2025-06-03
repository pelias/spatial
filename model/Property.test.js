const tap = require('tap')
const Property = require('./Property')

// constructor
tap.test('constructor: empty', (t) => {
  let p = new Property()
  t.equal(p.key, undefined)
  t.equal(p.value, undefined)
  t.end()
})
tap.test('constructor: key only', (t) => {
  let p = new Property('key')
  t.equal(p.key, 'key')
  t.equal(p.value, undefined)
  t.end()
})
tap.test('constructor: value only', (t) => {
  let p = new Property(undefined, 'value')
  t.equal(p.key, undefined)
  t.equal(p.value, 'value')
  t.end()
})
tap.test('constructor: key and value', (t) => {
  let p = new Property('key', 'value')
  t.equal(p.key, 'key')
  t.equal(p.value, 'value')
  t.end()
})

// setKey
tap.test('setKey: undefined', (t) => {
  let p = new Property()
  p.setKey(undefined)
  t.equal(p.key, undefined)
  t.end()
})
tap.test('setKey: array', (t) => {
  let p = new Property()
  p.setKey([])
  t.equal(p.key, undefined)
  t.end()
})
tap.test('setKey: object', (t) => {
  let p = new Property()
  p.setKey({})
  t.equal(p.key, undefined)
  t.end()
})
tap.test('setKey: nil object', (t) => {
  let p = new Property()
  p.setKey(null)
  t.equal(p.key, undefined)
  t.end()
})
tap.test('setKey: number', (t) => {
  let p = new Property()
  p.setKey(1)
  t.equal(p.key, undefined)
  t.end()
})
tap.test('setKey: nil number', (t) => {
  let p = new Property()
  p.setKey(NaN)
  t.equal(p.key, undefined)
  t.end()
})
tap.test('setKey: string', (t) => {
  let p = new Property()
  p.setKey('test')
  t.equal(p.key, 'test')
  t.end()
})
tap.test('setKey: nil string', (t) => {
  let p = new Property()
  p.setKey('')
  t.equal(p.key, '')
  t.end()
})

// setValue
tap.test('setValue: undefined', (t) => {
  let p = new Property()
  p.setValue(undefined)
  t.equal(p.value, undefined)
  t.end()
})
tap.test('setValue: array', (t) => {
  let p = new Property()
  p.setValue([])
  t.equal(p.value, undefined)
  t.end()
})
tap.test('setValue: object', (t) => {
  let p = new Property()
  p.setValue({})
  t.equal(p.value, undefined)
  t.end()
})
tap.test('setValue: nil object', (t) => {
  let p = new Property()
  p.setValue(null)
  t.equal(p.value, undefined)
  t.end()
})
tap.test('setValue: number', (t) => {
  let p = new Property()
  p.setValue(1)
  t.equal(p.value, undefined)
  t.end()
})
tap.test('setValue: nil number', (t) => {
  let p = new Property()
  p.setValue(NaN)
  t.equal(p.value, undefined)
  t.end()
})
tap.test('setValue: string', (t) => {
  let p = new Property()
  p.setValue('test')
  t.equal(p.value, 'test')
  t.end()
})
tap.test('setValue: nil string', (t) => {
  let p = new Property()
  p.setValue('')
  t.equal(p.value, '')
  t.end()
})

// isValid
tap.test('isValid: empty', (t) => {
  let p = new Property()
  t.notOk(p._isValid())
  t.end()
})
tap.test('isValid: key only', (t) => {
  let p = new Property('key')
  t.notOk(p._isValid())
  t.end()
})
tap.test('isValid: value only', (t) => {
  let p = new Property(undefined, 'value')
  t.notOk(p._isValid())
  t.end()
})
tap.test('isValid: empty key and value', (t) => {
  let p = new Property('', 'value')
  t.notOk(p._isValid())
  t.end()
})
tap.test('isValid: key and empty value', (t) => {
  let p = new Property('key', '')
  t.notOk(p._isValid())
  t.end()
})
tap.test('isValid: key and value', (t) => {
  let p = new Property('key', 'value')
  t.ok(p._isValid())
  t.end()
})
