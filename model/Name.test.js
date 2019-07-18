const Name = require('./Name')

module.exports.tests = {}

module.exports.tests.constructor = (test) => {
  test('constructor: empty', (t) => {
    let n = new Name()
    t.equals(n.lang, undefined)
    t.equals(n.tag, undefined)
    t.equals(n.abbr, undefined)
    t.equals(n.name, undefined)
    t.end()
  })
  test('constructor: lang only', (t) => {
    let n = new Name('lang')
    t.equals(n.lang, 'lang')
    t.equals(n.tag, undefined)
    t.equals(n.abbr, undefined)
    t.equals(n.name, undefined)
    t.end()
  })
  test('constructor: tag only', (t) => {
    let n = new Name(undefined, 'tag')
    t.equals(n.lang, undefined)
    t.equals(n.tag, 'tag')
    t.equals(n.abbr, undefined)
    t.equals(n.name, undefined)
    t.end()
  })
  test('constructor: abbr only', (t) => {
    let n = new Name(undefined, undefined, true)
    t.equals(n.lang, undefined)
    t.equals(n.tag, undefined)
    t.equals(n.abbr, true)
    t.equals(n.name, undefined)
    t.end()
  })
  test('constructor: name only', (t) => {
    let n = new Name(undefined, undefined, undefined, 'example')
    t.equals(n.lang, undefined)
    t.equals(n.tag, undefined)
    t.equals(n.abbr, undefined)
    t.equals(n.name, 'example')
    t.end()
  })
  test('constructor: all properties', (t) => {
    let n = new Name('lang', 'tag', false, 'example')
    t.equals(n.lang, 'lang')
    t.equals(n.tag, 'tag')
    t.equals(n.abbr, false)
    t.equals(n.name, 'example')
    t.end()
  })
}

module.exports.tests.setLang = (test) => {
  test('setLang: undefined', (t) => {
    let n = new Name()
    n.setLang(undefined)
    t.equals(n.lang, undefined)
    t.end()
  })
  test('setLang: array', (t) => {
    let n = new Name()
    n.setLang([])
    t.equals(n.lang, undefined)
    t.end()
  })
  test('setLang: object', (t) => {
    let n = new Name()
    n.setLang({})
    t.equals(n.lang, undefined)
    t.end()
  })
  test('setLang: nil object', (t) => {
    let n = new Name()
    n.setLang(null)
    t.equals(n.lang, undefined)
    t.end()
  })
  test('setLang: number', (t) => {
    let n = new Name()
    n.setLang(1)
    t.equals(n.lang, undefined)
    t.end()
  })
  test('setLang: nil number', (t) => {
    let n = new Name()
    n.setLang(NaN)
    t.equals(n.lang, undefined)
    t.end()
  })
  test('setLang: string', (t) => {
    let n = new Name()
    n.setLang('test')
    t.equals(n.lang, 'test')
    t.end()
  })
  test('setLang: nil string', (t) => {
    let n = new Name()
    n.setLang('')
    t.equals(n.lang, '')
    t.end()
  })
}

module.exports.tests.setTag = (test) => {
  test('setTag: undefined', (t) => {
    let n = new Name()
    n.setTag(undefined)
    t.equals(n.tag, undefined)
    t.end()
  })
  test('setTag: array', (t) => {
    let n = new Name()
    n.setTag([])
    t.equals(n.tag, undefined)
    t.end()
  })
  test('setTag: object', (t) => {
    let n = new Name()
    n.setTag({})
    t.equals(n.tag, undefined)
    t.end()
  })
  test('setTag: nil object', (t) => {
    let n = new Name()
    n.setTag(null)
    t.equals(n.tag, undefined)
    t.end()
  })
  test('setTag: number', (t) => {
    let n = new Name()
    n.setTag(1)
    t.equals(n.tag, undefined)
    t.end()
  })
  test('setTag: nil number', (t) => {
    let n = new Name()
    n.setTag(NaN)
    t.equals(n.tag, undefined)
    t.end()
  })
  test('setTag: string', (t) => {
    let n = new Name()
    n.setTag('test')
    t.equals(n.tag, 'test')
    t.end()
  })
  test('setTag: nil string', (t) => {
    let n = new Name()
    n.setTag('')
    t.equals(n.tag, '')
    t.end()
  })
}

module.exports.tests.setAbbr = (test) => {
  test('setAbbr: undefined', (t) => {
    let n = new Name()
    n.setAbbr(undefined)
    t.equals(n.abbr, undefined)
    t.end()
  })
  test('setAbbr: array', (t) => {
    let n = new Name()
    n.setAbbr([])
    t.equals(n.abbr, undefined)
    t.end()
  })
  test('setAbbr: object', (t) => {
    let n = new Name()
    n.setAbbr({})
    t.equals(n.abbr, undefined)
    t.end()
  })
  test('setAbbr: nil object', (t) => {
    let n = new Name()
    n.setAbbr(null)
    t.equals(n.abbr, undefined)
    t.end()
  })
  test('setAbbr: number', (t) => {
    let n = new Name()
    n.setAbbr(1)
    t.equals(n.abbr, undefined)
    t.end()
  })
  test('setAbbr: nil number', (t) => {
    let n = new Name()
    n.setAbbr(NaN)
    t.equals(n.abbr, undefined)
    t.end()
  })
  test('setAbbr: string', (t) => {
    let n = new Name()
    n.setAbbr('test')
    t.equals(n.abbr, undefined)
    t.end()
  })
  test('setAbbr: nil string', (t) => {
    let n = new Name()
    n.setAbbr('')
    t.equals(n.abbr, undefined)
    t.end()
  })
  test('setAbbr: true', (t) => {
    let n = new Name()
    n.setAbbr(true)
    t.equals(n.abbr, true)
    t.end()
  })
  test('setAbbr: false', (t) => {
    let n = new Name()
    n.setAbbr(false)
    t.equals(n.abbr, false)
    t.end()
  })
}

module.exports.tests.setName = (test) => {
  test('setName: undefined', (t) => {
    let n = new Name()
    n.setName(undefined)
    t.equals(n.name, undefined)
    t.end()
  })
  test('setName: array', (t) => {
    let n = new Name()
    n.setName([])
    t.equals(n.name, undefined)
    t.end()
  })
  test('setName: object', (t) => {
    let n = new Name()
    n.setName({})
    t.equals(n.name, undefined)
    t.end()
  })
  test('setName: nil object', (t) => {
    let n = new Name()
    n.setName(null)
    t.equals(n.name, undefined)
    t.end()
  })
  test('setName: number', (t) => {
    let n = new Name()
    n.setName(1)
    t.equals(n.name, undefined)
    t.end()
  })
  test('setName: nil number', (t) => {
    let n = new Name()
    n.setName(NaN)
    t.equals(n.name, undefined)
    t.end()
  })
  test('setName: string', (t) => {
    let n = new Name()
    n.setName('test')
    t.equals(n.name, 'test')
    t.end()
  })
  test('setName: nil string', (t) => {
    let n = new Name()
    n.setName('')
    t.equals(n.name, '')
    t.end()
  })
}

module.exports.tests.isValid = (test) => {
  test('inValid: empty', (t) => {
    let n = new Name()
    t.false(n._isValid())
    t.end()
  })
  test('inValid: lang only', (t) => {
    let n = new Name('lang')
    t.false(n._isValid())
    t.end()
  })
  test('inValid: tag only', (t) => {
    let n = new Name(undefined, 'tag')
    t.false(n._isValid())
    t.end()
  })
  test('inValid: abbr only', (t) => {
    let n = new Name(undefined, undefined, true)
    t.false(n._isValid())
    t.end()
  })
  test('inValid: name only', (t) => {
    let n = new Name(undefined, undefined, undefined, 'example')
    t.false(n._isValid())
    t.end()
  })
  test('inValid: all properties', (t) => {
    let n = new Name('lang', 'tag', false, 'example')
    t.true(n._isValid())
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`Name: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
