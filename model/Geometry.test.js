const format = require('../import/format')
const Geometry = require('./Geometry')

module.exports.tests = {}

const fixture = format.from('polygon', 'geojson', require('../test/fixture/geojson.triangle'))

module.exports.tests.constructor = (test) => {
  test('constructor: empty', (t) => {
    let g = new Geometry()
    t.equals(g.geometry, undefined)
    t.equals(g.role, undefined)
    t.end()
  })
  test('constructor: geometry only', (t) => {
    let g = new Geometry(fixture)
    t.equals(g.geometry, fixture)
    t.equals(g.role, undefined)
    t.end()
  })
  test('constructor: role only', (t) => {
    let g = new Geometry(undefined, 'role')
    t.equals(g.geometry, undefined)
    t.equals(g.role, 'role')
    t.end()
  })
  test('constructor: geometry and role', (t) => {
    let g = new Geometry(fixture, 'role')
    t.equals(g.geometry, fixture)
    t.equals(g.role, 'role')
    t.end()
  })
}

module.exports.tests.setGeometry = (test) => {
  test('setGeometry: undefined', (t) => {
    let g = new Geometry()
    g.setGeometry(undefined)
    t.equals(g.geometry, undefined)
    t.end()
  })
  test('setGeometry: array', (t) => {
    let g = new Geometry()
    g.setGeometry([])
    t.equals(g.geometry, undefined)
    t.end()
  })
  test('setGeometry: object', (t) => {
    let g = new Geometry()
    g.setGeometry({})
    t.equals(g.geometry, undefined)
    t.end()
  })
  test('setGeometry: nil object', (t) => {
    let g = new Geometry()
    g.setGeometry(null)
    t.equals(g.geometry, undefined)
    t.end()
  })
  test('setGeometry: number', (t) => {
    let g = new Geometry()
    g.setGeometry(1)
    t.equals(g.geometry, undefined)
    t.end()
  })
  test('setGeometry: nil number', (t) => {
    let g = new Geometry()
    g.setGeometry(NaN)
    t.equals(g.geometry, undefined)
    t.end()
  })
  test('setGeometry: string', (t) => {
    let g = new Geometry()
    g.setGeometry('test')
    t.equals(g.geometry, undefined)
    t.end()
  })
  test('setGeometry: nil string', (t) => {
    let g = new Geometry()
    g.setGeometry('')
    t.equals(g.geometry, undefined)
    t.end()
  })
  test('setGeometry: instanceof Geometry', (t) => {
    let g = new Geometry()
    g.setGeometry(fixture)
    t.equals(g.geometry, fixture)
    t.end()
  })
}

module.exports.tests.setRole = (test) => {
  test('setRole: undefined', (t) => {
    let g = new Geometry()
    g.setRole(undefined)
    t.equals(g.role, undefined)
    t.end()
  })
  test('setRole: array', (t) => {
    let g = new Geometry()
    g.setRole([])
    t.equals(g.role, undefined)
    t.end()
  })
  test('setRole: object', (t) => {
    let g = new Geometry()
    g.setRole({})
    t.equals(g.role, undefined)
    t.end()
  })
  test('setRole: nil object', (t) => {
    let g = new Geometry()
    g.setRole(null)
    t.equals(g.role, undefined)
    t.end()
  })
  test('setRole: number', (t) => {
    let g = new Geometry()
    g.setRole(1)
    t.equals(g.role, undefined)
    t.end()
  })
  test('setRole: nil number', (t) => {
    let g = new Geometry()
    g.setRole(NaN)
    t.equals(g.role, undefined)
    t.end()
  })
  test('setRole: string', (t) => {
    let g = new Geometry()
    g.setRole('test')
    t.equals(g.role, 'test')
    t.end()
  })
  test('setRole: nil string', (t) => {
    let g = new Geometry()
    g.setRole('')
    t.equals(g.role, '')
    t.end()
  })
}

module.exports.tests.isValid = (test) => {
  test('isValid: empty', (t) => {
    let g = new Geometry()
    t.false(g._isValid())
    t.end()
  })
  test('isValid: geometry only', (t) => {
    let g = new Geometry(fixture)
    t.false(g._isValid())
    t.end()
  })
  test('isValid: role only', (t) => {
    let g = new Geometry(undefined, 'role')
    t.false(g._isValid())
    t.end()
  })
  test('isValid: empty geometry and role', (t) => {
    let g = new Geometry('', 'role')
    t.false(g._isValid())
    t.end()
  })
  test('isValid: geometry and empty role', (t) => {
    let g = new Geometry(fixture, '')
    t.false(g._isValid())
    t.end()
  })
  test('isValid: geometry and role', (t) => {
    let g = new Geometry(fixture, 'role')
    t.true(g._isValid())
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`Geometry: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
