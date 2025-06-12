const _ = require('lodash')
const verbose = require('./pip_verbose')
const layerCompatibility = new Set([
  'neighbourhood',
  'borough',
  'locality',
  'localadmin',
  'county',
  'macrocounty',
  'macroregion',
  'region',
  'dependency',
  'country',
  'empire',
  'continent',
  'marinearea',
  'ocean'
])

// a custom 'view' which emulates the legacy pelias PIP format (with some additions!)
// see: https://github.com/pelias/wof-admin-lookup
module.exports = function (req, res) {
  // inputs
  req.query = {
    lon: req.params.lon,
    lat: req.params.lat,
    aliaslimit: 0,
    wofonly: 1,
    hierarchy: true
  }

  verbose.bind({ remap: remapFromHierarchy })(req, res)
}

// rewite the verbose view to match the expected format
// function remap (resp) {
//   for (let placetype in resp) {
//     if (layerCompatibility.has(placetype)) {
//       resp[placetype] = resp[placetype].map(row => {
//         return {
//           id: parseInt(row.id, 10),
//           name: row.name,
//           abbr: row.abbr,
//           centroid: row.centroid,
//           bounding_box: row.bounding_box
//         }
//       })
//     } else {
//       delete resp[placetype]
//     }
//   }
//   return resp
// }

// rewite the verbose view to match the expected format
// using the 'lowest' matching placetype as the base and adopting
// the hierarchy from that record for the parents.
function remapFromHierarchy (resp) {
  for (const layer of layerCompatibility) {
    const lowest = _.get(resp, layer) // find 'lowest' layer matches (array)
    if (lowest) {
      const r = {
        [layer]: lowest.map(place => {
          place.id = parseInt(place.id, 10) // for compatibility
          return _.omit(place, ['hierarchy', 'source'])
        })
      }
      lowest.forEach(place => {
        for (const placetype in place.hierarchy) {
          if (!r[placetype]) { r[placetype] = [] }
          const parent = place.hierarchy[placetype]
          parent.id = parseInt(parent.id, 10) // for compatibility
          if (r[placetype].some(v => v.id === parent.id)) { continue } // dedupe
          r[placetype].push(parent)
        }
      })
      return r
    }
  }
  return {}
}
