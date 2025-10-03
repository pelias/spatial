const _ = require('lodash')
const util = require('./util')
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

// layers which should be added from the 'pure pip' results if not
// present in the hierarchy.
const hoistLayers = new Set([
  'country',
  'dependency',
  'empire',
  'continent'
])

// a custom 'view' which emulates the legacy pelias PIP format (with some additions!)
// see: https://github.com/pelias/wof-admin-lookup
function controller (req, res) {
  // configurable layers via query param
  const queryLayers = new Set(util.commaSeparatedArrayOfStrings(req.query.layers))

  const params = {
    lon: parseFloat(util.flatten(req.params.lon)),
    lat: parseFloat(util.flatten(req.params.lat))
  }

  // send json
  res.status(200)
    .json(query(req.app.locals.service, params, queryLayers))
}

// perform query
function query (service, params, queryLayers) {
  const rows = service.module.pip.statement.summary.all({
    lat: params.lat,
    lon: params.lon
  })

  const searchLayers = (queryLayers && queryLayers.size) ? new Set(_.intersection([...displayLayers], [...queryLayers])) : displayLayers
  return remapFromHierarchy(parseRows(rows), searchLayers)
}

function parseHierarchy (hierarchyStr) {
  return _.mapValues(
    JSON.parse(hierarchyStr || '{}'),
    (parent) => {
      Object.assign(parent, boundsAndCentroid(parent))
      parent.bounds = undefined
      return parent
    }
  )
}

function parseRows (rows) {
  let resp = {}
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (!resp[row.type]) { resp[row.type] = [] }
    resp[row.type].push({
      ...row,
      ...boundsAndCentroid(row),
      hierarchy: parseHierarchy(row.hierarchy),
      distance: util.floatPrecision7(row.distance)
    })
  }
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

  // 'hoist' some layers from the pure pip results if not already present
  for (const placetype of hoistLayers) {
    if (!mapped[placetype] && resp[placetype]) {
      mapped[placetype] = resp[placetype].map(normalize)
    }
  }

  return mapped
}

function normalize (place) {
  const res = _.pick(place, ['id', 'name', 'abbr', 'centroid', 'bounding_box'])
  res.id = parseInt(res.id, 10) // for compatibility (wof IDs are always numeric)
  if (!res.abbr) { res.abbr = undefined }
  return res
}

function boundsAndCentroid (row) {
  const centroid = { lat: 0, lon: 0 }
  let bounds = [centroid.lon, centroid.lat, centroid.lon, centroid.lat]

  if (row.centroid) {
    const commaIndex = row.centroid.indexOf(',')
    centroid.lon = util.floatPrecision7(parseFloat(row.centroid.slice(0, commaIndex)))
    centroid.lat = util.floatPrecision7(parseFloat(row.centroid.slice(commaIndex + 1)))
  }

  if (row.bounds) {
    bounds = row.bounds.split(',').map(util.floatPrecision7)
  }

  return { centroid, bounding_box: bounds.join(',') }
}

module.exports = {
  controller,
  query,
  parseRows,
  remapFromHierarchy,
  normalize,
  boundsAndCentroid
}
