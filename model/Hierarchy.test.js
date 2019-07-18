const Hierarchy = require('./Hierarchy')
const Identity = require('./Identity')

module.exports.tests = {}

const fixture = {
  child: new Identity('A', '1'),
  parent: new Identity('B', '2')
}

module.exports.tests.constructor = (test) => {
  test('constructor: empty', (t) => {
    let h = new Hierarchy()
    t.equals(h.child, undefined)
    t.equals(h.parent, undefined)
    t.equals(h.branch, undefined)
    t.end()
  })
  test('constructor: child only', (t) => {
    let h = new Hierarchy(fixture.child)
    t.equals(h.child, fixture.child)
    t.equals(h.parent, undefined)
    t.equals(h.branch, undefined)
    t.end()
  })
  test('constructor: parent only', (t) => {
    let h = new Hierarchy(undefined, fixture.parent)
    t.equals(h.child, undefined)
    t.equals(h.parent, fixture.parent)
    t.equals(h.branch, undefined)
    t.end()
  })
  test('constructor: branch only', (t) => {
    let h = new Hierarchy(undefined, undefined, 'example')
    t.equals(h.child, undefined)
    t.equals(h.parent, undefined)
    t.equals(h.branch, 'example')
    t.end()
  })
  test('constructor: child, parent & branch', (t) => {
    let h = new Hierarchy(fixture.child, fixture.parent, 'example')
    t.equals(h.child, fixture.child)
    t.equals(h.parent, fixture.parent)
    t.equals(h.branch, 'example')
    t.end()
  })
}

module.exports.tests.setChild = (test) => {
  test('setChild: undefined', (t) => {
    let h = new Hierarchy()
    h.setChild(undefined)
    t.equals(h.child, undefined)
    t.end()
  })
  test('setChild: array', (t) => {
    let h = new Hierarchy()
    h.setChild([])
    t.equals(h.child, undefined)
    t.end()
  })
  test('setChild: object', (t) => {
    let h = new Hierarchy()
    h.setChild({})
    t.equals(h.child, undefined)
    t.end()
  })
  test('setChild: nil object', (t) => {
    let h = new Hierarchy()
    h.setChild(null)
    t.equals(h.child, undefined)
    t.end()
  })
  test('setChild: number', (t) => {
    let h = new Hierarchy()
    h.setChild(1)
    t.equals(h.child, undefined)
    t.end()
  })
  test('setChild: nil number', (t) => {
    let h = new Hierarchy()
    h.setChild(NaN)
    t.equals(h.child, undefined)
    t.end()
  })
  test('setChild: string', (t) => {
    let h = new Hierarchy()
    h.setChild('test')
    t.equals(h.child, undefined)
    t.end()
  })
  test('setChild: nil string', (t) => {
    let h = new Hierarchy()
    h.setChild('')
    t.equals(h.child, undefined)
    t.end()
  })
  test('setChild: instanceof Identity', (t) => {
    let h = new Hierarchy()
    h.setChild(fixture.child)
    t.equals(h.child, fixture.child)
    t.end()
  })
}

module.exports.tests.setParent = (test) => {
  test('setParent: undefined', (t) => {
    let h = new Hierarchy()
    h.setParent(undefined)
    t.equals(h.parent, undefined)
    t.end()
  })
  test('setParent: array', (t) => {
    let h = new Hierarchy()
    h.setParent([])
    t.equals(h.parent, undefined)
    t.end()
  })
  test('setParent: object', (t) => {
    let h = new Hierarchy()
    h.setParent({})
    t.equals(h.parent, undefined)
    t.end()
  })
  test('setParent: nil object', (t) => {
    let h = new Hierarchy()
    h.setParent(null)
    t.equals(h.parent, undefined)
    t.end()
  })
  test('setParent: number', (t) => {
    let h = new Hierarchy()
    h.setParent(1)
    t.equals(h.parent, undefined)
    t.end()
  })
  test('setParent: nil number', (t) => {
    let h = new Hierarchy()
    h.setParent(NaN)
    t.equals(h.parent, undefined)
    t.end()
  })
  test('setParent: string', (t) => {
    let h = new Hierarchy()
    h.setParent('test')
    t.equals(h.parent, undefined)
    t.end()
  })
  test('setParent: nil string', (t) => {
    let h = new Hierarchy()
    h.setParent('')
    t.equals(h.parent, undefined)
    t.end()
  })
  test('setParent: instanceof Identity', (t) => {
    let h = new Hierarchy()
    h.setParent(fixture.parent)
    t.equals(h.parent, fixture.parent)
    t.end()
  })
}

module.exports.tests.isValid = (test) => {
  test('isValid: empty', (t) => {
    let h = new Hierarchy()
    t.false(h._isValid())
    t.end()
  })
  test('isValid: child only', (t) => {
    let h = new Hierarchy(fixture.child)
    t.false(h._isValid())
    t.end()
  })
  test('isValid: parent only', (t) => {
    let h = new Hierarchy(undefined, fixture.parent)
    t.false(h._isValid())
    t.end()
  })
  test('isValid: branch only', (t) => {
    let h = new Hierarchy(undefined, undefined, 'example')
    t.false(h._isValid())
    t.end()
  })
  test('isValid: empty child', (t) => {
    let h = new Hierarchy(undefined, fixture.parent, 'example')
    t.false(h._isValid())
    t.end()
  })
  test('isValid: empty parent', (t) => {
    let h = new Hierarchy(fixture.child, undefined, 'example')
    t.false(h._isValid())
    t.end()
  })
  test('isValid: empty branch', (t) => {
    let h = new Hierarchy(fixture.child, fixture.parent, undefined)
    t.false(h._isValid())
    t.end()
  })
  test('isValid: child, parent & branch', (t) => {
    let h = new Hierarchy(fixture.child, fixture.parent, 'example')
    t.true(h._isValid())
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`Hierarchy: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
