const tap = require('tap')
const Place = require('../../../../model/Place')
const map = require('./properties')

// mapper
tap.test('mapper: properties empty', (t) => {
  let p = new Place()
  map(p, {})

  t.equal(p.property.length, 0)
  t.end()
})
tap.test('mapper: uscensus-specific properties', (t) => {
  let p = new Place()
  map(p, {
    'CLASSFP10': 'B5',
    'MTFCC10': 'G6350',
    'INTPTLON10': 1.1,
    'INTPTLAT10': 2.2
  })

  t.equal(p.property.length, 2)
  t.equal(p.property[0].key, 'uscensus:CLASSFP10', 'CLASSFP10')
  t.equal(p.property[0].value, 'B5', 'CLASSFP10')
  t.equal(p.property[1].key, 'uscensus:MTFCC10', 'MTFCC10')
  t.equal(p.property[1].value, 'G6350', 'MTFCC10')
  t.end()
})
