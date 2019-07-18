const Ontology = require('./Ontology')

module.exports.tests = {}

module.exports.tests.constructor = (test) => {
  test('constructor: empty', (t) => {
    let o = new Ontology()
    t.equals(o.class, undefined)
    t.equals(o.type, undefined)
    t.end()
  })
  test('constructor: class only', (t) => {
    let o = new Ontology('class')
    t.equals(o.class, 'class')
    t.equals(o.type, undefined)
    t.end()
  })
  test('constructor: type only', (t) => {
    let o = new Ontology(undefined, 'type')
    t.equals(o.class, undefined)
    t.equals(o.type, 'type')
    t.end()
  })
  test('constructor: class and type', (t) => {
    let o = new Ontology('class', 'type')
    t.equals(o.class, 'class')
    t.equals(o.type, 'type')
    t.end()
  })
}

module.exports.tests.setClass = (test) => {
  test('setClass: undefined', (t) => {
    let o = new Ontology()
    o.setClass(undefined)
    t.equals(o.class, undefined)
    t.end()
  })
  test('setClass: array', (t) => {
    let o = new Ontology()
    o.setClass([])
    t.equals(o.class, undefined)
    t.end()
  })
  test('setClass: object', (t) => {
    let o = new Ontology()
    o.setClass({})
    t.equals(o.class, undefined)
    t.end()
  })
  test('setClass: nil object', (t) => {
    let o = new Ontology()
    o.setClass(null)
    t.equals(o.class, undefined)
    t.end()
  })
  test('setClass: number', (t) => {
    let o = new Ontology()
    o.setClass(1)
    t.equals(o.class, undefined)
    t.end()
  })
  test('setClass: nil number', (t) => {
    let o = new Ontology()
    o.setClass(NaN)
    t.equals(o.class, undefined)
    t.end()
  })
  test('setClass: string', (t) => {
    let o = new Ontology()
    o.setClass('test')
    t.equals(o.class, 'test')
    t.end()
  })
  test('setClass: nil string', (t) => {
    let o = new Ontology()
    o.setClass('')
    t.equals(o.class, '')
    t.end()
  })
}

module.exports.tests.setType = (test) => {
  test('setType: undefined', (t) => {
    let o = new Ontology()
    o.setType(undefined)
    t.equals(o.type, undefined)
    t.end()
  })
  test('setType: array', (t) => {
    let o = new Ontology()
    o.setType([])
    t.equals(o.type, undefined)
    t.end()
  })
  test('setType: object', (t) => {
    let o = new Ontology()
    o.setType({})
    t.equals(o.type, undefined)
    t.end()
  })
  test('setType: nil object', (t) => {
    let o = new Ontology()
    o.setType(null)
    t.equals(o.type, undefined)
    t.end()
  })
  test('setType: number', (t) => {
    let o = new Ontology()
    o.setType(1)
    t.equals(o.type, undefined)
    t.end()
  })
  test('setType: nil number', (t) => {
    let o = new Ontology()
    o.setType(NaN)
    t.equals(o.type, undefined)
    t.end()
  })
  test('setType: string', (t) => {
    let o = new Ontology()
    o.setType('test')
    t.equals(o.type, 'test')
    t.end()
  })
  test('setType: nil string', (t) => {
    let o = new Ontology()
    o.setType('')
    t.equals(o.type, '')
    t.end()
  })
}

module.exports.tests.isValid = (test) => {
  test('isValid: empty', (t) => {
    let o = new Ontology()
    t.false(o._isValid())
    t.end()
  })
  test('isValid: class only', (t) => {
    let o = new Ontology('class')
    t.false(o._isValid())
    t.end()
  })
  test('isValid: type only', (t) => {
    let o = new Ontology(undefined, 'type')
    t.false(o._isValid())
    t.end()
  })
  test('isValid: empty class and type', (t) => {
    let o = new Ontology('', 'type')
    t.false(o._isValid())
    t.end()
  })
  test('isValid: class and empty type', (t) => {
    let o = new Ontology('class', '')
    t.false(o._isValid())
    t.end()
  })
  test('isValid: class and type', (t) => {
    let o = new Ontology('class', 'type')
    t.true(o._isValid())
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`Ontology: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
