const _ = require('lodash')
const verbose = require('./pip_verbose')
const untrustedLayers = new Set(['neighbourhood'])

/**
 * @todo: only search layers provided in query
 */

const defaultLayers = new Set([
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
// using the 'lowest' matching placetype as the base and adopting
// the hierarchy from that record for the parents.
function remapFromHierarchy (resp) {
  const mapped = {}
  let chosen = [] // the chosen 'lowest layer' to use for the hierarchy

  // iterate through compatible layers
  for (const layer of defaultLayers) {
    if (!_.has(resp, layer)) { continue }
    chosen = _.get(resp, layer)

    // map properties from the lowest matching layer
    mapped[layer] = chosen.map(normalize)

    // don't trust the hierarchy from some 'untrusted layers'
    // https://github.com/pelias/wof-admin-lookup/pull/246
    if (!untrustedLayers.has(layer)) { break }
  }

  // iterate through chosen hits (there may be multiple hits for this one placetype)
  // and adopt the hierarchy from each.
  chosen.forEach(place => {
    for (const [placetype, parent] of Object.entries(place.hierarchy)) {
      const norm = normalize(parent)
      if (!Array.isArray(mapped[placetype])) { mapped[placetype] = [] }
      mapped[placetype].push(norm)
    }
  })

  // dedupe and clean results
  for (const placetype of Object.keys(mapped)) {
    // remove any placetypes not in the compatibility list
    // note: we may elect to remove this filter in the future
    if (!defaultLayers.has(placetype)) {
      delete mapped[placetype]
      continue
    }

    mapped[placetype] = _.uniqBy(mapped[placetype], 'id')
  }

  return mapped
}

function normalize (place) {
  const res = _.pick(place, ['id', 'name', 'abbr', 'centroid', 'bounding_box'])
  res.id = parseInt(res.id, 10) // for compatibility (wof IDs are always numeric)
  if (!res.abbr) { delete res.abbr }
  return res
}
