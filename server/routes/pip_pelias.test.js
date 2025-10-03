const _ = require('lodash')
const tap = require('tap')
const pelias = require('./pip_pelias').controller
const mock = require('node-mocks-http')
const proxy = (fn) => _.set({}, 'locals.service.module.pip.statement.summary.all', fn)

tap.test('remapFromHierarchy - Martinborough', (t) => {
  let res = mock.createResponse()
  let req = mock.createRequest({
    params: { lon: 175.4166635, lat: -41.221498 },
    app: proxy((query) => {
      t.same(query, {
        lon: 175.4166635,
        lat: -41.221498
      })
      return require('./fixtures/martinborough_summary.rows.json')
    })
  })

  pelias(req, res)
  t.equal(200, res.statusCode)
  t.same(res._getJSONData(), {
    locality: [
      {
        id: 101914287,
        name: 'Martinborough',
        centroid: { lat: -41.2232135, lon: 175.4797177 },
        bounding_box: '175.400013,-41.301336,175.564123,-41.145135'
      }
    ],
    county: [
      {
        id: 102079347,
        name: 'South Wairarapa District',
        abbr: 'SP',
        centroid: { lat: -41.2674375, lon: 175.4177081 },
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
        centroid: { lat: -41.220145, lon: 175.417246 },
        bounding_box: '174.388038,-41.815112,176.56406,-40.628591'
      }
    ]
  })
  t.end()
})

tap.test('remapFromHierarchy - Oamaru', (t) => {
  let res = mock.createResponse()
  let req = mock.createRequest({
    params: { lon: 170.96879300000001, lat: -45.098982 },
    app: proxy((query) => {
      t.same(query, {
        lon: 170.96879300000001,
        lat: -45.098982
      })
      return require('./fixtures/oamaru_summary.rows.json')
    })
  })

  pelias(req, res)
  t.equal(200, res.statusCode)
  t.same(res._getJSONData(), {
    locality: [
      {
        id: 101914699,
        name: 'Oamaru',
        centroid: { lat: -45.092746, lon: 170.9677059 },
        bounding_box: '170.949378,-45.103048,170.983274,-45.083577'
      }
    ],
    county: [
      {
        id: 102079381,
        name: 'Waitaki District',
        abbr: 'WI',
        centroid: { lat: -44.6831305, lon: 170.1858918 },
        bounding_box: '169.542497,-45.575812,171.144216,-43.788862'
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
    localadmin: [
      {
        id: 1729238521,
        name: 'Oamaru',
        centroid: { lat: -45.0734125, lon: 170.9570003 },
        bounding_box: '170.897807,-45.122193,171.019312,-45.024824'
      }
    ],
    region: [
      {
        id: 85687201,
        name: 'Otago Region',
        abbr: 'OT',
        centroid: { lat: -45.3968555, lon: 170.1775072 },
        bounding_box: '168.116395,-46.839379,171.406801,-43.955425'
      }
    ]
  })
  t.end()
})

// Don't trust the hierarchy from neighbuorhood layers, instead
// use the hierarchy from the parent.
tap.test('remapFromHierarchy - Untrusted Layers - Single Match', (t) => {
  let res = mock.createResponse()
  let req = mock.createRequest({
    params: { lon: 1, lat: 1 },
    app: proxy((query) => {
      t.same(query, {
        lon: 1,
        lat: 1
      })
      return [
        {
          source: 'wof',
          id: '1111',
          type: 'neighbourhood',
          bounds: '1,2,1,2',
          centroid: '1,2',
          name: 'Example Neighbourhood',
          name_localized: 'Example Neighbourhood',
          names: null,
          abbr: 'EXA',
          abbrs: null,
          hierarchy: JSON.stringify({
            locality: {
              id: '2222',
              bounds: '3,4,3,4',
              centroid: '3,4',
              name: 'Example Locality',
              abbr: 'LOC'
            }
          })
        }
      ]
    })
  })

  pelias(req, res)
  t.equal(200, res.statusCode)
  t.same(res._getJSONData(), {
    neighbourhood: [
      {
        id: 1111,
        name: 'Example Neighbourhood',
        abbr: 'EXA',
        centroid: { lat: 2, lon: 1 },
        bounding_box: '1,2,1,2'
      }
    ],
    locality: [
      {
        id: 2222,
        name: 'Example Locality',
        abbr: 'LOC',
        centroid: { lat: 4, lon: 3 },
        bounding_box: '3,4,3,4'
      }
    ]
  })
  t.end()
})

tap.test('remapFromHierarchy - Untrusted Layers - Multi Match', (t) => {
  let res = mock.createResponse()
  let req = mock.createRequest({
    params: { lon: 1, lat: 1 },
    app: proxy((query) => {
      t.same(query, {
        lon: 1,
        lat: 1
      })
      return [
        {
          source: 'wof',
          id: '1111',
          type: 'neighbourhood',
          bounds: '1,2,1,2',
          centroid: '1,2',
          name: 'Example Neighbourhood',
          name_localized: 'Example Neighbourhood',
          names: null,
          abbr: 'EXA',
          abbrs: null,
          hierarchy: JSON.stringify({
            locality: {
              id: '2222',
              bounds: '3,4,3,4',
              centroid: '3,4',
              name: 'Example Locality',
              abbr: 'LOC'
            }
          })
        },
        {
          source: 'wof',
          id: '3333',
          type: 'region',
          bounds: '5,6,5,6',
          centroid: '5,6',
          name: 'Example Region',
          name_localized: 'Example Region',
          names: null,
          abbr: 'REG',
          abbrs: null,
          hierarchy: JSON.stringify({
            country: {
              id: '4444',
              bounds: '7,8,7,8',
              centroid: '7,8',
              name: 'Example Country',
              abbr: 'COU'
            }
          })
        }
      ]
    })
  })

  pelias(req, res)
  t.equal(200, res.statusCode)
  t.same(res._getJSONData(), {
    neighbourhood: [
      {
        id: 1111,
        name: 'Example Neighbourhood',
        abbr: 'EXA',
        centroid: { lat: 2, lon: 1 },
        bounding_box: '1,2,1,2'
      }
    ],
    region: [
      {
        id: 3333,
        name: 'Example Region',
        abbr: 'REG',
        centroid: { lat: 6, lon: 5 },
        bounding_box: '5,6,5,6'
      }
    ],
    country: [
      {
        id: 4444,
        name: 'Example Country',
        abbr: 'COU',
        centroid: { lat: 8, lon: 7 },
        bounding_box: '7,8,7,8'
      }
    ]
  })
  t.end()
})

// The 'lowest' layer must belong to the specified layers, parentage can be from any layer
tap.test('pelias - layer filter', (t) => {
  let res = mock.createResponse()
  let req = mock.createRequest({
    params: { lon: 170.96879300000001, lat: -45.098982 },
    query: { layers: 'country, region,' },
    app: proxy((query) => {
      t.same(query, {
        lon: 170.96879300000001,
        lat: -45.098982
      })
      return require('./fixtures/oamaru_summary.rows.json')
    })
  })

  pelias(req, res)
  t.equal(200, res.statusCode)
  t.same(res._getJSONData(), {
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
        id: 85687201,
        name: 'Otago Region',
        abbr: 'OT',
        centroid: { lat: -45.3968555, lon: 170.1775072 },
        bounding_box: '168.116395,-46.839379,171.406801,-43.955425'
      }
    ]
  })
  t.end()
})

// at time of writin the locality of lancing has -1 values for {region, county, continent}
// https://spelunker.whosonfirst.org/id/1125843731
tap.test('remapFromHierarchy - Lancing', (t) => {
  let res = mock.createResponse()
  let req = mock.createRequest({
    params: { lon: -0.332593, lat: 50.830056 },
    app: proxy((query) => {
      t.same(query, {
        lon: -0.332593,
        lat: 50.830056
      })
      return require('./fixtures/lancing_summary.rows.json')
    })
  })

  pelias(req, res)
  t.equal(200, res.statusCode)
  t.same(res._getJSONData(), {
    locality: [
      {
        id: 1125843731,
        name: 'Lancing',
        centroid: { lat: 50.83314, lon: -0.3085617 },
        bounding_box: '-0.337211,50.816041,-0.284364,50.849996'
      }
    ],
    localadmin: [
      {
        id: 404433635,
        name: 'Lancing Civil Parish',
        centroid: { lat: 50.8331403, lon: -0.3085615 },
        bounding_box: '-0.3372113,50.8160407,-0.2843642,50.849996'
      }
    ],
    county: [
      {
        id: 1880771683,
        name: 'Adur',
        centroid: { lat: 50.845215, lon: -0.2939033 },
        bounding_box: '-0.371517,50.81603,-0.215295,50.874738'
      }
    ],
    macrocounty: [
      {
        id: 1880762061,
        name: 'West Sussex',
        centroid: { lat: 50.944699, lon: -0.5276061 },
        bounding_box: '-0.957597,50.722029,0.04455,51.167304'
      }
    ],
    country: [
      {
        id: 85633159,
        name: 'United Kingdom',
        abbr: 'GBR',
        centroid: { lat: 54.314473, lon: -1.9212754 },
        bounding_box: '-8.649996,49.864632,1.768975,60.860867'
      }
    ],
    empire: [
      {
        id: 136253055,
        name: 'United Kingdom',
        centroid: { lat: 54.3140933, lon: -1.9116522 },
        bounding_box: '-130.7530818,-59.4727516,72.4946395,60.8478865'
      }
    ],
    continent: [
      {
        id: 102191581,
        name: 'Europe',
        centroid: { lat: 53.5665955, lon: 34.4425412 },
        bounding_box: '-24.539906,34.815009,69.033946,81.85871'
      }
    ]
  })
  t.end()
})
