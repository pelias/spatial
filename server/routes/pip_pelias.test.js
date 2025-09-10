const _ = require('lodash')
const tap = require('tap')
const pelias = require('./pip_pelias')
const mock = require('node-mocks-http')
const proxy = (fn) => _.set({}, 'locals.service.module.pip.statement.summary.all', fn)

tap.test('remapFromHierarchy - Martinborough', (t) => {
  let res = mock.createResponse()
  let req = mock.createRequest({
    params: { lon: 175.4166635, lat: -41.221498 },
    app: proxy((query) => {
      t.same(query, {
        lon: 175.4166635,
        lat: -41.221498,
        limit: 1000,
        roles: '\u001eboundary\u001e',
        sources: '\u001ewof\u001e',
        hierarchy: 1
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
      },
      {
        id: 1729339735,
        name: 'Dyerville',
        centroid: { lat: -41.2756255, lon: 175.3799931 },
        bounding_box: '175.290524,-41.335574,175.439075,-41.215716'
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
        lat: -45.098982,
        limit: 1000,
        roles: '\u001eboundary\u001e',
        sources: '\u001ewof\u001e',
        hierarchy: 1
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
        lat: 1,
        limit: 1000,
        roles: '\u001eboundary\u001e',
        sources: '\u001ewof\u001e',
        hierarchy: 1
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
        lat: 1,
        limit: 1000,
        roles: '\u001eboundary\u001e',
        sources: '\u001ewof\u001e',
        hierarchy: 1
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
        lat: -45.098982,
        limit: 1000,
        roles: '\u001eboundary\u001e',
        sources: '\u001ewof\u001e',
        hierarchy: 1
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
