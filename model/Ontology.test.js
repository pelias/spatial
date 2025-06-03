const tap = require('tap')
const Ontology = require('./Ontology')

// constructor
tap.test('constructor: empty', (t) => {
  let o = new Ontology()
  t.equal(o.class, undefined)
  t.equal(o.type, undefined)
  t.end()
})
tap.test('constructor: class only', (t) => {
  let o = new Ontology('class')
  t.equal(o.class, 'class')
  t.equal(o.type, undefined)
  t.end()
})
tap.test('constructor: type only', (t) => {
  let o = new Ontology(undefined, 'type')
  t.equal(o.class, undefined)
  t.equal(o.type, 'type')
  t.end()
})
tap.test('constructor: class and type', (t) => {
  let o = new Ontology('class', 'type')
  t.equal(o.class, 'class')
  t.equal(o.type, 'type')
  t.end()
})

// setClass
tap.test('setClass: undefined', (t) => {
  let o = new Ontology()
  o.setClass(undefined)
  t.equal(o.class, undefined)
  t.end()
})
tap.test('setClass: array', (t) => {
  let o = new Ontology()
  o.setClass([])
  t.equal(o.class, undefined)
  t.end()
})
tap.test('setClass: object', (t) => {
  let o = new Ontology()
  o.setClass({})
  t.equal(o.class, undefined)
  t.end()
})
tap.test('setClass: nil object', (t) => {
  let o = new Ontology()
  o.setClass(null)
  t.equal(o.class, undefined)
  t.end()
})
tap.test('setClass: number', (t) => {
  let o = new Ontology()
  o.setClass(1)
  t.equal(o.class, undefined)
  t.end()
})
tap.test('setClass: nil number', (t) => {
  let o = new Ontology()
  o.setClass(NaN)
  t.equal(o.class, undefined)
  t.end()
})
tap.test('setClass: string', (t) => {
  let o = new Ontology()
  o.setClass('test')
  t.equal(o.class, 'test')
  t.end()
})
tap.test('setClass: nil string', (t) => {
  let o = new Ontology()
  o.setClass('')
  t.equal(o.class, '')
  t.end()
})

// setType
tap.test('setType: undefined', (t) => {
  let o = new Ontology()
  o.setType(undefined)
  t.equal(o.type, undefined)
  t.end()
})
tap.test('setType: array', (t) => {
  let o = new Ontology()
  o.setType([])
  t.equal(o.type, undefined)
  t.end()
})
tap.test('setType: object', (t) => {
  let o = new Ontology()
  o.setType({})
  t.equal(o.type, undefined)
  t.end()
})
tap.test('setType: nil object', (t) => {
  let o = new Ontology()
  o.setType(null)
  t.equal(o.type, undefined)
  t.end()
})
tap.test('setType: number', (t) => {
  let o = new Ontology()
  o.setType(1)
  t.equal(o.type, undefined)
  t.end()
})
tap.test('setType: nil number', (t) => {
  let o = new Ontology()
  o.setType(NaN)
  t.equal(o.type, undefined)
  t.end()
})
tap.test('setType: string', (t) => {
  let o = new Ontology()
  o.setType('test')
  t.equal(o.type, 'test')
  t.end()
})
tap.test('setType: nil string', (t) => {
  let o = new Ontology()
  o.setType('')
  t.equal(o.type, '')
  t.end()
})
tap.test('setType: normalize: trim', (t) => {
  let o = new Ontology()
  o.setType(' \t\ntest \n\t')
  t.equal(o.type, 'test')
  t.end()
})
tap.test('setType: normalize: lowercase', (t) => {
  let o = new Ontology()
  o.setType('TeST')
  t.equal(o.type, 'test')
  t.end()
})
tap.test('setType: normalize: replace spaces with underscores', (t) => {
  let o = new Ontology()
  o.setType('test type')
  t.equal(o.type, 'test_type')
  t.end()
})

// isValid
tap.test('isValid: empty', (t) => {
  let o = new Ontology()
  t.notOk(o._isValid())
  t.end()
})
tap.test('isValid: class only', (t) => {
  let o = new Ontology('class')
  t.notOk(o._isValid())
  t.end()
})
tap.test('isValid: type only', (t) => {
  let o = new Ontology(undefined, 'type')
  t.notOk(o._isValid())
  t.end()
})
tap.test('isValid: empty class and type', (t) => {
  let o = new Ontology('', 'type')
  t.notOk(o._isValid())
  t.end()
})
tap.test('isValid: class and empty type', (t) => {
  let o = new Ontology('class', '')
  t.notOk(o._isValid())
  t.end()
})
tap.test('isValid: class and type', (t) => {
  let o = new Ontology('class', 'type')
  t.ok(o._isValid())
  t.end()
})
