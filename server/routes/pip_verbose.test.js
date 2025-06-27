const _ = require('lodash')
const tap = require('tap')
const verbose = require('./pip_verbose')
const mock = require('node-mocks-http')
const proxy = (fn) => _.set({}, 'locals.service.module.pip.statement.verbose.all', fn)

tap.test('remapFromHierarchy - Martinborough', (t) => {
  let res = mock.createResponse()
  let req = mock.createRequest({
    query: { lon: 175.4166635, lat: -41.221498, sources: 'wof', hierarchy: 1 },
    app: proxy((query) => {
      t.same(query, {
        lon: 175.4166635,
        lat: -41.221498,
        limit: 1000,
        aliaslimit: 0,
        sources: '\u001ewof\u001e',
        lang: 'und',
        hierarchy: 1
      })
      return require('./fixtures/martinborough_verbose.rows.json')
    })
  })

  verbose(req, res)
  t.equal(200, res.statusCode)
  t.same(res._getJSONData(), {
    locality: [
      {
        id: '101914287',
        source: 'wof',
        name: 'Martinborough',
        centroid: { lat: -41.2232135, lon: 175.4797177 },
        bounding_box: '175.400001,-41.301336,175.564123,-41.145135',
        hierarchy: {
          county: {
            id: 102079347,
            name: 'South Wairarapa District',
            abbr: 'SP',
            centroid: {
              lat: -41.2673995,
              lon: 175.417743
            },
            bounding_box: '174.958653,-41.613549,175.809775,-40.921064'
          },
          country: {
            id: 85633345,
            name: 'New Zealand',
            abbr: 'NZL',
            centroid: {
              lat: -43.586223,
              lon: 171.2117928
            },
            bounding_box: '-176.893092,-47.289993,178.577174,-33.958498'
          },
          region: {
            id: 85687233,
            name: 'Wellington Region',
            abbr: 'WG',
            centroid: {
              lat: -41.2214985,
              lon: 175.4166635
            },
            bounding_box: '174.388038,-41.815112,176.56406,-40.628591'
          }
        },
        distance: 0
      }
    ],
    county: [
      {
        id: '102079347',
        source: 'wof',
        name: 'South Wairarapa District',
        abbr: 'SP',
        centroid: { lat: -41.2673995, lon: 175.417743 },
        bounding_box: '174.958653,-41.613549,175.809775,-40.921064',
        hierarchy: {
          country: {
            id: '85633345',
            name: 'New Zealand',
            abbr: 'NZL',
            centroid: {
              lat: -43.586223,
              lon: 171.2117928
            },
            bounding_box: '-176.893092,-47.289993,178.577174,-33.958498'
          },
          region: {
            id: '85687233',
            name: 'Wellington Region',
            abbr: 'WG',
            centroid: {
              lat: -41.2214985,
              lon: 175.4166635
            },
            bounding_box: '174.388038,-41.815112,176.56406,-40.628591'
          }
        },
        distance: 0
      }
    ],
    country: [
      {
        id: '85633345',
        source: 'wof',
        name: 'New Zealand',
        abbr: 'NZL',
        centroid: { lat: -43.586223, lon: 171.2117928 },
        bounding_box: '-176.893092,-47.289993,178.577174,-33.958498',
        hierarchy: {},
        distance: 0
      }
    ],
    region: [
      {
        id: '85687233',
        source: 'wof',
        name: 'Wellington Region',
        abbr: 'WG',
        centroid: { lat: -41.2214985, lon: 175.4166635 },
        bounding_box: '174.388038,-41.815112,176.56406,-40.628591',
        hierarchy: {
          country: {
            id: '85633345',
            name: 'New Zealand',
            abbr: 'NZL',
            centroid: {
              lat: -43.586223,
              lon: 171.2117928
            },
            bounding_box: '-176.893092,-47.289993,178.577174,-33.958498'
          }
        },
        distance: 0
      }
    ]
  })
  t.end()
})

// note: Oamaru is in the 'Otago Region', this is correctly represented for lower
// placetypes, but the 'county' placetypes returns 'Canterbury Region' due to the
// reverse geo centroid position.
tap.test('remapFromHierarchy - Oamaru', (t) => {
  let res = mock.createResponse()
  let req = mock.createRequest({
    query: { lon: 170.96879300000001, lat: -45.098982, sources: 'wof', hierarchy: 1 },
    app: proxy((query) => {
      t.same(query, {
        lon: 170.96879300000001,
        lat: -45.098982,
        limit: 1000,
        aliaslimit: 0,
        sources: '\u001ewof\u001e',
        lang: 'und',
        hierarchy: 1
      })
      return require('./fixtures/oamaru_verbose.rows.json')
    })
  })

  verbose(req, res)
  t.equal(200, res.statusCode)
  t.same(res._getJSONData(), {
    locality: [
      {
        id: '101914699',
        source: 'wof',
        name: 'Oamaru',
        centroid: { lat: -45.0927995, lon: 170.9676509 },
        bounding_box: '170.949378,-45.103048,170.983274,-45.083577',
        hierarchy: {
          county: {
            id: '102079381',
            name: 'Waitaki District',
            abbr: 'WI',
            centroid: {
              lat: -44.6831305,
              lon: 170.1858918
            },
            bounding_box: '169.542497,-45.575812,171.144216,-43.788862'
          },
          localadmin: {
            id: '1729238521',
            name: 'Oamaru',
            abbr: null,
            centroid: {
              lat: -45.073514,
              lon: 170.9569513
            },
            bounding_box: '170.897807,-45.122193,171.01932,-45.024824'
          },
          country: {
            id: '85633345',
            name: 'New Zealand',
            abbr: 'NZL',
            centroid: {
              lat: -43.586223,
              lon: 171.2117928
            },
            bounding_box: '-176.893092,-47.289993,178.577174,-33.958498'
          },
          region: {
            id: '85687201',
            name: 'Otago Region',
            abbr: 'OT',
            centroid: {
              lat: -45.3973235,
              lon: 170.1778035
            },
            bounding_box: '168.116395,-46.839379,171.406801,-43.955411'
          }
        },
        distance: 0
      }
    ],
    county: [
      {
        id: '102079381',
        source: 'wof',
        name: 'Waitaki District',
        abbr: 'WI',
        centroid: { lat: -44.6831305, lon: 170.1858918 },
        bounding_box: '169.542497,-45.575812,171.144216,-43.788862',
        hierarchy: {
          country: {
            id: '85633345',
            name: 'New Zealand',
            abbr: 'NZL',
            centroid: {
              lat: -43.586223,
              lon: 171.2117928
            },
            bounding_box: '-176.893092,-47.289993,178.577174,-33.958498'
          },
          region: {
            id: '85687179',
            name: 'Canterbury Region',
            abbr: 'CA',
            centroid: {
              lat: -43.494176,
              lon: 171.8097687
            },
            bounding_box: '169.542498,-45.080929,174.264103,-41.907383'
          }
        },
        distance: 0
      }
    ],
    country: [
      {
        id: '85633345',
        source: 'wof',
        name: 'New Zealand',
        abbr: 'NZL',
        centroid: { lat: -43.586223, lon: 171.2117928 },
        bounding_box: '-176.893092,-47.289993,178.577174,-33.958498',
        hierarchy: {},
        distance: 0
      }
    ],
    localadmin: [
      {
        id: '1729238521',
        source: 'wof',
        name: 'Oamaru',
        centroid: {
          lat: -45.073514,
          lon: 170.9569513
        },
        bounding_box: '170.897807,-45.122193,171.01932,-45.024824',
        hierarchy: {
          county: {
            id: '102079381',
            name: 'Waitaki District',
            abbr: 'WI',
            centroid: {
              lat: -44.6831305,
              lon: 170.1858918
            },
            bounding_box: '169.542497,-45.575812,171.144216,-43.788862'
          },
          country: {
            id: '85633345',
            name: 'New Zealand',
            abbr: 'NZL',
            centroid: {
              lat: -43.586223,
              lon: 171.2117928
            },
            bounding_box: '-176.893092,-47.289993,178.577174,-33.958498'
          },
          region: {
            id: '85687201',
            name: 'Otago Region',
            abbr: 'OT',
            centroid: {
              lat: -45.3973235,
              lon: 170.1778035
            },
            bounding_box: '168.116395,-46.839379,171.406801,-43.955411'
          }
        },
        distance: 0
      }
    ],
    region: [
      {
        id: '85687201',
        source: 'wof',
        name: 'Otago Region',
        abbr: 'OT',
        centroid: { lat: -45.3973235, lon: 170.1778035 },
        bounding_box: '168.116395,-46.839379,171.406801,-43.955411',
        hierarchy: {
          country: {
            id: '85633345',
            name: 'New Zealand',
            abbr: 'NZL',
            centroid: {
              lat: -43.586223,
              lon: 171.2117928
            },
            bounding_box: '-176.893092,-47.289993,178.577174,-33.958498'
          }
        },
        distance: 0
      }
    ]
  })
  t.end()
})
