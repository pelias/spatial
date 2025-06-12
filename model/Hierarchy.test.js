const tap = require('tap')
const Hierarchy = require('./Hierarchy')
const Identity = require('./Identity')

const fixture = {
  child: new Identity('A', '1'),
  parent: new Identity('B', '2')
}

// constructor
tap.test('constructor: empty', (t) => {
  let h = new Hierarchy()
  t.equal(h.child, undefined)
  t.equal(h.parent, undefined)
  t.equal(h.branch, undefined)
  t.equal(h.depth, Hierarchy.UNKNOWN_DEPTH)
  t.end()
})
tap.test('constructor: child only', (t) => {
  let h = new Hierarchy(fixture.child)
  t.equal(h.child, fixture.child)
  t.equal(h.parent, undefined)
  t.equal(h.branch, undefined)
  t.equal(h.depth, Hierarchy.UNKNOWN_DEPTH)
  t.end()
})
tap.test('constructor: parent only', (t) => {
  let h = new Hierarchy(undefined, fixture.parent)
  t.equal(h.child, undefined)
  t.equal(h.parent, fixture.parent)
  t.equal(h.branch, undefined)
  t.equal(h.depth, Hierarchy.UNKNOWN_DEPTH)
  t.end()
})
tap.test('constructor: branch only', (t) => {
  let h = new Hierarchy(undefined, undefined, 'example')
  t.equal(h.child, undefined)
  t.equal(h.parent, undefined)
  t.equal(h.branch, 'example')
  t.equal(h.depth, Hierarchy.UNKNOWN_DEPTH)
  t.end()
})
tap.test('constructor: child, parent & branch', (t) => {
  let h = new Hierarchy(fixture.child, fixture.parent, 'example')
  t.equal(h.child, fixture.child)
  t.equal(h.parent, fixture.parent)
  t.equal(h.branch, 'example')
  t.equal(h.depth, Hierarchy.UNKNOWN_DEPTH)
  t.end()
})
tap.test('constructor: child, parent, branch & depth', (t) => {
  let h = new Hierarchy(fixture.child, fixture.parent, 'example', 0)
  t.equal(h.child, fixture.child)
  t.equal(h.parent, fixture.parent)
  t.equal(h.branch, 'example')
  t.equal(h.depth, 0)
  t.end()
})

// setChild
tap.test('setChild: undefined', (t) => {
  let h = new Hierarchy()
  h.setChild(undefined)
  t.equal(h.child, undefined)
  t.end()
})
tap.test('setChild: array', (t) => {
  let h = new Hierarchy()
  h.setChild([])
  t.equal(h.child, undefined)
  t.end()
})
tap.test('setChild: object', (t) => {
  let h = new Hierarchy()
  h.setChild({})
  t.equal(h.child, undefined)
  t.end()
})
tap.test('setChild: nil object', (t) => {
  let h = new Hierarchy()
  h.setChild(null)
  t.equal(h.child, undefined)
  t.end()
})
tap.test('setChild: number', (t) => {
  let h = new Hierarchy()
  h.setChild(1)
  t.equal(h.child, undefined)
  t.end()
})
tap.test('setChild: nil number', (t) => {
  let h = new Hierarchy()
  h.setChild(NaN)
  t.equal(h.child, undefined)
  t.end()
})
tap.test('setChild: string', (t) => {
  let h = new Hierarchy()
  h.setChild('test')
  t.equal(h.child, undefined)
  t.end()
})
tap.test('setChild: nil string', (t) => {
  let h = new Hierarchy()
  h.setChild('')
  t.equal(h.child, undefined)
  t.end()
})
tap.test('setChild: instanceof Identity', (t) => {
  let h = new Hierarchy()
  h.setChild(fixture.child)
  t.equal(h.child, fixture.child)
  t.end()
})

// setParent
tap.test('setParent: undefined', (t) => {
  let h = new Hierarchy()
  h.setParent(undefined)
  t.equal(h.parent, undefined)
  t.end()
})
tap.test('setParent: array', (t) => {
  let h = new Hierarchy()
  h.setParent([])
  t.equal(h.parent, undefined)
  t.end()
})
tap.test('setParent: object', (t) => {
  let h = new Hierarchy()
  h.setParent({})
  t.equal(h.parent, undefined)
  t.end()
})
tap.test('setParent: nil object', (t) => {
  let h = new Hierarchy()
  h.setParent(null)
  t.equal(h.parent, undefined)
  t.end()
})
tap.test('setParent: number', (t) => {
  let h = new Hierarchy()
  h.setParent(1)
  t.equal(h.parent, undefined)
  t.end()
})
tap.test('setParent: nil number', (t) => {
  let h = new Hierarchy()
  h.setParent(NaN)
  t.equal(h.parent, undefined)
  t.end()
})
tap.test('setParent: string', (t) => {
  let h = new Hierarchy()
  h.setParent('test')
  t.equal(h.parent, undefined)
  t.end()
})
tap.test('setParent: nil string', (t) => {
  let h = new Hierarchy()
  h.setParent('')
  t.equal(h.parent, undefined)
  t.end()
})
tap.test('setParent: instanceof Identity', (t) => {
  let h = new Hierarchy()
  h.setParent(fixture.parent)
  t.equal(h.parent, fixture.parent)
  t.end()
})

// isValid
tap.test('isValid: empty', (t) => {
  let h = new Hierarchy()
  t.notOk(h._isValid())
  t.end()
})
tap.test('isValid: child only', (t) => {
  let h = new Hierarchy(fixture.child)
  t.notOk(h._isValid())
  t.end()
})
tap.test('isValid: parent only', (t) => {
  let h = new Hierarchy(undefined, fixture.parent)
  t.notOk(h._isValid())
  t.end()
})
tap.test('isValid: branch only', (t) => {
  let h = new Hierarchy(undefined, undefined, 'example')
  t.notOk(h._isValid())
  t.end()
})
tap.test('isValid: empty child', (t) => {
  let h = new Hierarchy(undefined, fixture.parent, 'example')
  t.notOk(h._isValid())
  t.end()
})
tap.test('isValid: empty parent', (t) => {
  let h = new Hierarchy(fixture.child, undefined, 'example')
  t.notOk(h._isValid())
  t.end()
})
tap.test('isValid: empty branch', (t) => {
  let h = new Hierarchy(fixture.child, fixture.parent, undefined)
  t.notOk(h._isValid())
  t.end()
})
tap.test('isValid: invalid depth', (t) => {
  let h = new Hierarchy(fixture.child, fixture.parent, 'example', 'stringvalue')
  t.notOk(h._isValid())
  t.end()
})
tap.test('isValid: child, parent & branch', (t) => {
  let h = new Hierarchy(fixture.child, fixture.parent, 'example')
  t.ok(h._isValid())
  t.end()
})
