const tap = require('tap')
const Place = require('../../../../model/Place')
const Property = require('../../../../model/Property')
const map = require('./properties')

// mapper: division_area theme tests
tap.test('mapper: admin_level', (t) => {
  let p = new Place()
  map(p, { admin_level: 4 })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('admin_level', '4'))
  t.end()
})

tap.test('mapper: division_id', (t) => {
  let p = new Place()
  map(p, { division_id: '89e73df8-d5ab-4156-9e83-140d1ee694c5' })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('division_id', '89e73df8-d5ab-4156-9e83-140d1ee694c5'))
  t.end()
})

tap.test('mapper: is_land', (t) => {
  let p = new Place()
  map(p, { is_land: true })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('is_land', 'true'))
  t.end()
})

tap.test('mapper: is_territorial', (t) => {
  let p = new Place()
  map(p, { is_territorial: false })

  t.equal(p.property.length, 1)
  t.same(p.property[0], new Property('is_territorial', 'false'))
  t.end()
})

tap.test('mapper: multiple division_area properties', (t) => {
  let p = new Place()
  map(p, {
    country: 'NZ',
    subtype: 'county',
    admin_level: 6,
    division_id: '89e73df8-d5ab-4156-9e83-140d1ee694c5',
    class: 'land',
    is_land: true,
    is_territorial: true,
    version: 2
  })

  t.equal(p.property.length, 8)
  t.end()
})
