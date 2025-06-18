const _ = require('lodash')
const tap = require('tap')
const pelias = require('./pip_pelias')
const mock = require('node-mocks-http')
const proxy = (fn) => _.set({}, 'locals.service.module.pip.statement.verbose.all', fn)

tap.test('remapFromHierarchy - wellington', (t) => {
  let res = mock.createResponse()
  let req = mock.createRequest({
    params: { lat: -41.221498, lon: 175.4166635 },
    app: proxy(() => require('./fixtures/wellington_verbose.rows.json'))
  })

  pelias(req, res)
  t.equal(200, res.statusCode)
  t.same(res._getJSONData(), {
    locality: [
      {
        id: 101914287,
        name: 'Martinborough',
        centroid: { lat: -41.2232135, lon: 175.4797177 },
        bounding_box: '175.400001,-41.301336,175.564123,-41.145135'
      }
    ],
    county: [
      {
        id: 102079347,
        name: 'South Wairarapa District',
        abbr: 'SP',
        centroid: { lat: -41.2673995, lon: 175.417743 },
        bounding_box: '174.958653,-41.613549,175.809775,-40.921064'
      }
    ],
    country: [
      {
        id: 85633345,
        name: 'New Zealand',
        abbr: 'NZL',
        centroid: { lat: -43.586223, lon: 171.2117928 },
        bounding_box: '-176.893092,-47.289993,178.577174,-33.958498'
      }
    ],
    region: [
      {
        id: 85687233,
        name: 'Wellington Region',
        abbr: 'WG',
        centroid: { lat: -41.2214985, lon: 175.4166635 },
        bounding_box: '174.388038,-41.815112,176.56406,-40.628591'
      }
    ]
  })
  t.end()
})
