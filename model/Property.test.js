const Property = require('./Property')

module.exports.tests = {}

module.exports.tests.constructor = (test) => {
  test('constructor: empty', (t) => {
    let p = new Property()
    t.equals(p.key, undefined)
    t.equals(p.value, undefined)
    t.end()
  })
  test('constructor: key only', (t) => {
    let p = new Property('key')
    t.equals(p.key, 'key')
    t.equals(p.value, undefined)
    t.end()
  })
  test('constructor: value only', (t) => {
    let p = new Property(undefined, 'value')
    t.equals(p.key, undefined)
    t.equals(p.value, 'value')
    t.end()
  })
  test('constructor: key and value', (t) => {
    let p = new Property('key', 'value')
    t.equals(p.key, 'key')
    t.equals(p.value, 'value')
    t.end()
  })
}

module.exports.tests.setKey = (test) => {
  test('setKey: undefined', (t) => {
    let p = new Property()
    p.setKey(undefined)
    t.equals(p.key, undefined)
    t.end()
  })
  test('setKey: array', (t) => {
    let p = new Property()
    p.setKey([])
    t.equals(p.key, undefined)
    t.end()
  })
  test('setKey: object', (t) => {
    let p = new Property()
    p.setKey({})
    t.equals(p.key, undefined)
    t.end()
  })
  test('setKey: nil object', (t) => {
    let p = new Property()
    p.setKey(null)
    t.equals(p.key, undefined)
    t.end()
  })
  test('setKey: number', (t) => {
    let p = new Property()
    p.setKey(1)
    t.equals(p.key, undefined)
    t.end()
  })
  test('setKey: nil number', (t) => {
    let p = new Property()
    p.setKey(NaN)
    t.equals(p.key, undefined)
    t.end()
  })
  test('setKey: string', (t) => {
    let p = new Property()
    p.setKey('test')
    t.equals(p.key, 'test')
    t.end()
  })
  test('setKey: nil string', (t) => {
    let p = new Property()
    p.setKey('')
    t.equals(p.key, '')
    t.end()
  })
}

module.exports.tests.setValue = (test) => {
  test('setValue: undefined', (t) => {
    let p = new Property()
    p.setValue(undefined)
    t.equals(p.value, undefined)
    t.end()
  })
  test('setValue: array', (t) => {
    let p = new Property()
    p.setValue([])
    t.equals(p.value, undefined)
    t.end()
  })
  test('setValue: object', (t) => {
    let p = new Property()
    p.setValue({})
    t.equals(p.value, undefined)
    t.end()
  })
  test('setValue: nil object', (t) => {
    let p = new Property()
    p.setValue(null)
    t.equals(p.value, undefined)
    t.end()
  })
  test('setValue: number', (t) => {
    let p = new Property()
    p.setValue(1)
    t.equals(p.value, undefined)
    t.end()
  })
  test('setValue: nil number', (t) => {
    let p = new Property()
    p.setValue(NaN)
    t.equals(p.value, undefined)
    t.end()
  })
  test('setValue: string', (t) => {
    let p = new Property()
    p.setValue('test')
    t.equals(p.value, 'test')
    t.end()
  })
  test('setValue: nil string', (t) => {
    let p = new Property()
    p.setValue('')
    t.equals(p.value, '')
    t.end()
  })
}

module.exports.tests.isValid = (test) => {
  test('isValid: empty', (t) => {
    let p = new Property()
    t.false(p._isValid())
    t.end()
  })
  test('isValid: key only', (t) => {
    let p = new Property('key')
    t.false(p._isValid())
    t.end()
  })
  test('isValid: value only', (t) => {
    let p = new Property(undefined, 'value')
    t.false(p._isValid())
    t.end()
  })
  test('isValid: empty key and value', (t) => {
    let p = new Property('', 'value')
    t.false(p._isValid())
    t.end()
  })
  test('isValid: key and empty value', (t) => {
    let p = new Property('key', '')
    t.false(p._isValid())
    t.end()
  })
  test('isValid: key and value', (t) => {
    let p = new Property('key', 'value')
    t.true(p._isValid())
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`Property: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
