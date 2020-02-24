const tap = require('tap')
const scalar = require('./scalar')

// exports
tap.test('exports', (t) => {
  t.equal(typeof scalar, 'function')
  t.equal(scalar.length, 1)
  t.end()
})

// scalar
tap.test('scalar', (t) => {
  t.equal(scalar(' test '), 'test')
  t.equal(scalar(' test; foo '), 'test')
  t.equal(scalar(' test; foo; bar '), 'test')
  t.equal(scalar(' test;; foo; bar '), 'test;; foo')
  t.end()
})
