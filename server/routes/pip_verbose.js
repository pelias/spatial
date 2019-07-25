const util = require('./util')

/**
 * a verbose view of the PIP data
 *
 * set $aliaslimit > 0 to include name and abbrviation aliases
 * set @wofonly = 1 to only show results from whosonfirst
 **/
module.exports = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    lon: parseFloat(util.flatten(req.query.lon)),
    lat: parseFloat(util.flatten(req.query.lat)),
    limit: 1000,
    aliaslimit: parseInt(util.flatten(req.query.aliaslimit), 10) || 0,
    wofonly: util.flatten(req.query.wofonly) ? 1 : 0
  }

  // perform query
  console.time('took')
  let rows = service.module.pip.statement.verbose.all(query)
  console.timeEnd('took')

  // rewrite response to emulate 'wof-admin-lookup' format
  let resp = {}
  rows.forEach(row => {
    let centroid = row.centroid.split(',').map(util.floatPrecision7)

    let nameAlias = []
    if (query.aliaslimit > 0) { nameAlias = (row.names || '').split(String.fromCharCode(30)) }
    nameAlias = (nameAlias.length > 1) ? nameAlias.filter(n => n !== row.name).slice(0, query.aliaslimit) : undefined

    let abbrAlias = []
    if (query.aliaslimit > 0) { abbrAlias = (row.abbrs || '').split(String.fromCharCode(30)) }
    abbrAlias = (abbrAlias.length > 1) ? abbrAlias.filter(n => n !== row.name).slice(0, query.aliaslimit) : undefined

    if (!Array.isArray(resp[row.type])) { resp[row.type] = [] }
    resp[row.type].push({
      id: row.id,
      source: row.source,
      name: row.name || undefined,
      name_alias: nameAlias,
      abbr: row.abbr || undefined,
      abbr_alias: abbrAlias,
      centroid: {
        lat: centroid[1],
        lon: centroid[0]
      },
      bounding_box: row.bounds.split(',').map(util.floatPrecision7).join(',')
    })
  })

  // allow other views to utilize this view
  if (typeof this.remap === 'function') {
    resp = this.remap(resp)
  }

  // send json
  res.status(200).json(resp)
}
