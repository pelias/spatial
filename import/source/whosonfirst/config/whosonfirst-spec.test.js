const tap = require('tap')
const spec = require('./whosonfirst-spec')

// exports
tap.test('exports', (t) => {
  t.equal(typeof spec.spec, 'object')
  t.ok(spec.ids instanceof Map)
  t.ok(spec.names instanceof Map)
  t.equal(typeof spec.parents, 'function')
  t.end()
})

// spec
tap.test('spec', (t) => {
  t.same(Array.from(spec.ids.keys()), [
    102312307, 102312309, 102312311, 102312313, 102312317, 102312319, 102312321,
    102312323, 102312325, 102312327, 102312329, 102312331, 102312335, 102312341,
    102320821, 102322043, 102371933, 136057795, 404221409, 404221411, 404221413,
    404528653, 404528655, 421205763, 470996387, 1108746739, 1108906905, 1159162571,
    1159162573, 1159162575, 1159268867, 1159268869, 1360666019
  ])
  t.same(Array.from(spec.names.keys()), [
    'country', 'continent', 'region', 'county', 'locality', 'neighbourhood',
    'microhood', 'macrohood', 'venue', 'building', 'address', 'campus', 'empire',
    'planet', 'dependency', 'disputed', 'metroarea', 'timezone', 'localadmin',
    'macroregion', 'macrocounty', 'ocean', 'marinearea', 'borough', 'postalcode',
    'constituency', 'intersection', 'wing', 'concourse', 'arcade', 'enclosure',
    'installation', 'marketarea'
  ])
  t.end()
})

tap.test('getters', (t) => {
  t.same(spec.ids.get(102312307), spec.spec['102312307'])
  t.same(spec.names.get('country'), spec.spec['102312307'])
  t.end()
})

// rank
tap.test('rank', (t) => {
  t.ok(Array.from(spec.ids.values()).every(pt => pt.hasOwnProperty('rank')))
  t.equal(spec.names.get('planet').rank, 0)
  t.equal(spec.names.get('country').rank, 3)
  t.equal(spec.names.get('locality').rank, 10)
  t.equal(spec.names.get('neighbourhood').rank, 13)
  t.end()
})
// see: https://github.com/whosonfirst/whosonfirst-placetypes/issues/12
// tap.test('rank: no duplicate ranks', (t) => {
//   const pts = Array.from(spec.ids.values())
//   let seen = {}
//   pts.forEach(pt => {
//     if (!seen.hasOwnProperty(pt.rank)) { seen[pt.rank] = [] }
//     seen[pt.rank].push(pt)
//   })
//   for (let rank in seen) {
//     t.equal(seen[rank].length, 1, `rank ${rank}`)
//     if (seen[rank].length > 1) {
//       t.same(seen[rank].map(pt => pt.name), [], `rank ${rank}`)
//     }
//   }
//   t.end()
// })

// sortParents
tap.test('sortParents', (t) => {
  t.same(spec.names.get('planet').parent, [])
  t.same(spec.names.get('locality').parent, [404221409, 102312313, 102312311])
  t.same(spec.names.get('region').parent, [404221411, 102320821, 102322043, 102312307])
  t.end()
})
