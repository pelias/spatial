const _ = require('lodash')
const util = require('./util')
const verbose = require('./pip_verbose')
const untrustedLayers = new Set(['neighbourhood'])

/**
 * @todo: only search layers provided in query, currently all
 * layers in the db are searched. There *may* be a performance
 * benefit from excluding some layers; or not?
 */

// layers supported in the GeoJSON output
// note: some layers such as 'disputed', 'venue' etc. are excluded
const displayLayers = new Set([
  'neighbourhood',
  'borough',
  'postalcode',
  'locality',
  'localadmin',
  'county',
  'macrocounty',
  'region',
  'macroregion',
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
  // configurable layers via query param
  const queryLayers = new Set(util.commaSeparatedArrayOfStrings(req.query.layers))
  const searchLayers = queryLayers.size ? new Set(_.intersection([...displayLayers], [...queryLayers])) : displayLayers

  // inputs
  req.query = {
    lon: req.params.lon,
    lat: req.params.lat,
    aliaslimit: 0,
    wofonly: 1,
    hierarchy: true,
    searchLayers
  }

  // remap verbose view using custom formatter
  req.remap = remapFromHierarchy

  return verbose(req, res)
}

// rewite the verbose view to match the expected format
// using the 'lowest' matching placetype as the base and adopting
// the hierarchy from that record for the parents.
function remapFromHierarchy (resp, req) {
  const mapped = {}
  let chosen = [] // the chosen 'lowest layer' to use for the hierarchy

  // iterate through compatible layers
  for (const layer of req.query.searchLayers) {
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
      if (!displayLayers.has(placetype)) { continue }
      const norm = normalize(parent)
      if (!Array.isArray(mapped[placetype])) { mapped[placetype] = [] }
      mapped[placetype].push(norm)
    }
  })

  // dedupe and clean results
  for (const placetype of Object.keys(mapped)) {
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
