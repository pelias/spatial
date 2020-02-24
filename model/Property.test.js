const tap = require('tap')
const Property = require('./Property')

// constructor
tap.test('constructor: empty', (t) => {
  let p = new Property()
  t.equals(p.key, undefined)
  t.equals(p.value, undefined)
  t.end()
})
tap.test('constructor: key only', (t) => {
  let p = new Property('key')
  t.equals(p.key, 'key')
  t.equals(p.value, undefined)
  t.end()
})
tap.test('constructor: value only', (t) => {
  let p = new Property(undefined, 'value')
  t.equals(p.key, undefined)
  t.equals(p.value, 'value')
  t.end()
})
tap.test('constructor: key and value', (t) => {
  let p = new Property('key', 'value')
  t.equals(p.key, 'key')
  t.equals(p.value, 'value')
  t.end()
})

// setKey
tap.test('setKey: undefined', (t) => {
  let p = new Property()
  p.setKey(undefined)
  t.equals(p.key, undefined)
  t.end()
})
tap.test('setKey: array', (t) => {
  let p = new Property()
  p.setKey([])
  t.equals(p.key, undefined)
  t.end()
})
tap.test('setKey: object', (t) => {
  let p = new Property()
  p.setKey({})
  t.equals(p.key, undefined)
  t.end()
})
tap.test('setKey: nil object', (t) => {
  let p = new Property()
  p.setKey(null)
  t.equals(p.key, undefined)
  t.end()
})
tap.test('setKey: number', (t) => {
  let p = new Property()
  p.setKey(1)
  t.equals(p.key, undefined)
  t.end()
})
tap.test('setKey: nil number', (t) => {
  let p = new Property()
  p.setKey(NaN)
  t.equals(p.key, undefined)
  t.end()
})
tap.test('setKey: string', (t) => {
  let p = new Property()
  p.setKey('test')
  t.equals(p.key, 'test')
  t.end()
})
tap.test('setKey: nil string', (t) => {
  let p = new Property()
  p.setKey('')
  t.equals(p.key, '')
  t.end()
})

// setValue
tap.test('setValue: undefined', (t) => {
  let p = new Property()
  p.setValue(undefined)
  t.equals(p.value, undefined)
  t.end()
})
tap.test('setValue: array', (t) => {
  let p = new Property()
  p.setValue([])
  t.equals(p.value, undefined)
  t.end()
})
tap.test('setValue: object', (t) => {
  let p = new Property()
  p.setValue({})
  t.equals(p.value, undefined)
  t.end()
})
tap.test('setValue: nil object', (t) => {
  let p = new Property()
  p.setValue(null)
  t.equals(p.value, undefined)
  t.end()
})
tap.test('setValue: number', (t) => {
  let p = new Property()
  p.setValue(1)
  t.equals(p.value, undefined)
  t.end()
})
tap.test('setValue: nil number', (t) => {
  let p = new Property()
  p.setValue(NaN)
  t.equals(p.value, undefined)
  t.end()
})
tap.test('setValue: string', (t) => {
  let p = new Property()
  p.setValue('test')
  t.equals(p.value, 'test')
  t.end()
})
tap.test('setValue: nil string', (t) => {
  let p = new Property()
  p.setValue('')
  t.equals(p.value, '')
  t.end()
})

// isValid
tap.test('isValid: empty', (t) => {
  let p = new Property()
  t.false(p._isValid())
  t.end()
})
tap.test('isValid: key only', (t) => {
  let p = new Property('key')
  t.false(p._isValid())
  t.end()
})
tap.test('isValid: value only', (t) => {
  let p = new Property(undefined, 'value')
  t.false(p._isValid())
  t.end()
})
tap.test('isValid: empty key and value', (t) => {
  let p = new Property('', 'value')
  t.false(p._isValid())
  t.end()
})
tap.test('isValid: key and empty value', (t) => {
  let p = new Property('key', '')
  t.false(p._isValid())
  t.end()
})
tap.test('isValid: key and value', (t) => {
  let p = new Property('key', 'value')
  t.true(p._isValid())
  t.end()
})
