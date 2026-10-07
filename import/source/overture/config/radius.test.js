const tap = require('tap')
const radius = require('./radius')

tap.test('radius: default prominence (30)', (t) => {
  const r = radius()
  t.equal(r, 0.01)
  t.end()
})

tap.test('radius: very low prominence (20)', (t) => {
  const r = radius(20)
  t.equal(r, 0.01)
  t.end()
})

tap.test('radius: low prominence (30)', (t) => {
  const r = radius(30)
  t.equal(r, 0.01)
  t.end()
})

tap.test('radius: medium prominence (50)', (t) => {
  const r = radius(50)
  t.equal(r, 0.02)
  t.end()
})

tap.test('radius: high prominence (80)', (t) => {
  const r = radius(80)
  t.equal(r, 0.05)
  t.end()
})

tap.test('radius: very high prominence (90) - major city', (t) => {
  const r = radius(90)
  t.equal(r, 0.1)
  t.end()
})

tap.test('radius: medium-high prominence (65)', (t) => {
  const r = radius(65)
  t.equal(r, 0.02 + ((65 - 50) / 100)) // 0.17
  t.end()
})
