const _ = require('lodash')
const util = require('./util')
const untrustedLayers = new Set(['neighbourhood'])
const RECORD_SEPARATOR = String.fromCharCode(30)

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

  const query = {
    lon: parseFloat(util.flatten(req.params.lon)),
    lat: parseFloat(util.flatten(req.params.lat)),
    roles: `${RECORD_SEPARATOR}boundary${RECORD_SEPARATOR}`,
    sources: `${RECORD_SEPARATOR}wof${RECORD_SEPARATOR}`,
    hierarchy: 1,
    limit: 1000
  }

  // perform query
  // console.time('took')
  const service = req.app.locals.service
  const rows = service.module.pip.statement.summary.all(query)
  // console.timeEnd('took')

  const resp = remapFromHierarchy(parseRows(rows), searchLayers)

  // send json
  res.status(200).json(resp)
}

function parseRows (rows) {
  let resp = {}
  rows.forEach(row => {
    if (!Array.isArray(resp[row.type])) { resp[row.type] = [] }
    resp[row.type].push({
      ...row,
      ...boundsAndCentroid(row),
      hierarchy: _.mapValues(
        JSON.parse(row.hierarchy || '{}'),
        (parent) => {
          _.assign(parent, boundsAndCentroid(parent))
          delete parent.bounds
          return parent
        }
      ),
      distance: util.floatPrecision7(row.distance)
    })
  })
  return resp
}

// rewite the verbose view to match the expected format
// using the 'lowest' matching placetype as the base and adopting
// the hierarchy from that record for the parents.
function remapFromHierarchy (resp, searchLayers) {
  const mapped = {}
  let chosen = [] // the chosen 'lowest layer' to use for the hierarchy

  // iterate through compatible layers
  for (const layer of searchLayers) {
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

function boundsAndCentroid (row) {
  const centroidString = (row.centroid ? row.centroid : '0,0')
  const c = centroidString.split(',').map(util.floatPrecision7)

  return {
    centroid: { lat: c[1], lon: c[0] },
    bounding_box: (
      row.bounds ? row.bounds.split(',') : [c[0], c[1], c[0], c[1]]
    ).map(util.floatPrecision7).join(',')
  }
}
