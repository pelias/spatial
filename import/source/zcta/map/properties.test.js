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
    'CLASSFP20': 'B5',
    'MTFCC20': 'G6350',
    'INTPTLON20': 1.1,
    'INTPTLAT20': 2.2
  })

  t.equal(p.property.length, 2)
  t.equal(p.property[0].key, 'uscensus:CLASSFP20', 'CLASSFP20')
  t.equal(p.property[0].value, 'B5', 'CLASSFP20')
  t.equal(p.property[1].key, 'uscensus:MTFCC20', 'MTFCC20')
  t.equal(p.property[1].value, 'G6350', 'MTFCC20')
  t.end()
})
