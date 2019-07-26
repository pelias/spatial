const scalar = require('./scalar')

module.exports.tests = {}

module.exports.tests.exports = (test) => {
  test('exports', (t) => {
    t.equal(typeof scalar, 'function')
    t.equal(scalar.length, 1)
    t.end()
  })
}

module.exports.tests.scalar = (test) => {
  test('scalar', (t) => {
    t.equal(scalar(' test '), 'test')
    t.equal(scalar(' test; foo '), 'test')
    t.equal(scalar(' test; foo; bar '), 'test')
    t.equal(scalar(' test;; foo; bar '), 'test;; foo')
    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`scalar: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
