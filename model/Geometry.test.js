const tap = require('tap')
const format = require('../import/format')
const Geometry = require('./Geometry')

const fixture = format.from('polygon', 'geojson', require('../test/fixture/geojson.triangle'))

// constructor
tap.test('constructor: empty', (t) => {
  let g = new Geometry()
  t.equals(g.geometry, undefined)
  t.equals(g.role, undefined)
  t.end()
})
tap.test('constructor: geometry only', (t) => {
  let g = new Geometry(fixture)
  t.equals(g.geometry, fixture)
  t.equals(g.role, undefined)
  t.end()
})
tap.test('constructor: role only', (t) => {
  let g = new Geometry(undefined, 'role')
  t.equals(g.geometry, undefined)
  t.equals(g.role, 'role')
  t.end()
})
tap.test('constructor: geometry and role', (t) => {
  let g = new Geometry(fixture, 'role')
  t.equals(g.geometry, fixture)
  t.equals(g.role, 'role')
  t.end()
})

// setGeometry
tap.test('setGeometry: undefined', (t) => {
  let g = new Geometry()
  g.setGeometry(undefined)
  t.equals(g.geometry, undefined)
  t.end()
})
tap.test('setGeometry: array', (t) => {
  let g = new Geometry()
  g.setGeometry([])
  t.equals(g.geometry, undefined)
  t.end()
})
tap.test('setGeometry: object', (t) => {
  let g = new Geometry()
  g.setGeometry({})
  t.equals(g.geometry, undefined)
  t.end()
})
tap.test('setGeometry: nil object', (t) => {
  let g = new Geometry()
  g.setGeometry(null)
  t.equals(g.geometry, undefined)
  t.end()
})
tap.test('setGeometry: number', (t) => {
  let g = new Geometry()
  g.setGeometry(1)
  t.equals(g.geometry, undefined)
  t.end()
})
tap.test('setGeometry: nil number', (t) => {
  let g = new Geometry()
  g.setGeometry(NaN)
  t.equals(g.geometry, undefined)
  t.end()
})
tap.test('setGeometry: string', (t) => {
  let g = new Geometry()
  g.setGeometry('test')
  t.equals(g.geometry, undefined)
  t.end()
})
tap.test('setGeometry: nil string', (t) => {
  let g = new Geometry()
  g.setGeometry('')
  t.equals(g.geometry, undefined)
  t.end()
})
tap.test('setGeometry: instanceof Geometry', (t) => {
  let g = new Geometry()
  g.setGeometry(fixture)
  t.equals(g.geometry, fixture)
  t.end()
})

// setRole
tap.test('setRole: undefined', (t) => {
  let g = new Geometry()
  g.setRole(undefined)
  t.equals(g.role, undefined)
  t.end()
})
tap.test('setRole: array', (t) => {
  let g = new Geometry()
  g.setRole([])
  t.equals(g.role, undefined)
  t.end()
})
tap.test('setRole: object', (t) => {
  let g = new Geometry()
  g.setRole({})
  t.equals(g.role, undefined)
  t.end()
})
tap.test('setRole: nil object', (t) => {
  let g = new Geometry()
  g.setRole(null)
  t.equals(g.role, undefined)
  t.end()
})
tap.test('setRole: number', (t) => {
  let g = new Geometry()
  g.setRole(1)
  t.equals(g.role, undefined)
  t.end()
})
tap.test('setRole: nil number', (t) => {
  let g = new Geometry()
  g.setRole(NaN)
  t.equals(g.role, undefined)
  t.end()
})
tap.test('setRole: string', (t) => {
  let g = new Geometry()
  g.setRole('test')
  t.equals(g.role, 'test')
  t.end()
})
tap.test('setRole: nil string', (t) => {
  let g = new Geometry()
  g.setRole('')
  t.equals(g.role, '')
  t.end()
})

// isValid
tap.test('isValid: empty', (t) => {
  let g = new Geometry()
  t.false(g._isValid())
  t.end()
})
tap.test('isValid: geometry only', (t) => {
  let g = new Geometry(fixture)
  t.false(g._isValid())
  t.end()
})
tap.test('isValid: role only', (t) => {
  let g = new Geometry(undefined, 'role')
  t.false(g._isValid())
  t.end()
})
tap.test('isValid: empty geometry and role', (t) => {
  let g = new Geometry('', 'role')
  t.false(g._isValid())
  t.end()
})
tap.test('isValid: geometry and empty role', (t) => {
  let g = new Geometry(fixture, '')
  t.false(g._isValid())
  t.end()
})
tap.test('isValid: geometry and role', (t) => {
  let g = new Geometry(fixture, 'role')
  t.true(g._isValid())
  t.end()
})
