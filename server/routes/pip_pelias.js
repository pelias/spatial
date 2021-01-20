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
    wofonly: 1
  }

  verbose.bind({ remap: remap })(req, res)
}

// rewite the verbose view to match the expected format
function remap (resp) {
  for (let placetype in resp) {
    if (layerCompatibility.has(placetype)) {
      resp[placetype] = resp[placetype].map(row => {
        return {
          id: parseInt(row.id, 10),
          name: row.name,
          abbr: row.abbr,
          centroid: row.centroid,
          bounding_box: row.bounding_box
        }
      })
    } else {
      delete resp[placetype]
    }
  }
  return resp
}
