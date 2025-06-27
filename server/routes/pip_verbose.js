const _ = require('lodash')
const util = require('./util')
const iso6393 = require('iso-639-3')
const language = {}
const RECORD_SEPARATOR = String.fromCharCode(30)
iso6393.filter(i => !!i.iso6391 && !!i.iso6393).forEach(i => { language[i.iso6391] = i.iso6393 })

/**
 * a verbose view of the PIP data
 *
 * set $aliaslimit > 0 to include name and abbrviation aliases
 * set @wofonly = 1 to only show results from whosonfirst
 **/
module.exports = function (req, res) {
  const service = req.app.locals.service

  const lang = util.flatten(req.query.lang)
  const sources = util.flatten(req.query.wofonly) ? ['wof'] : util.toSources(req.query.sources)

  // inputs
  const query = {
    lon: parseFloat(util.flatten(req.query.lon)),
    lat: parseFloat(util.flatten(req.query.lat)),
    limit: 1000,
    aliaslimit: parseInt(util.flatten(req.query.aliaslimit), 10) || 0,
    sources: sources.length > 0 ? RECORD_SEPARATOR + sources.join(RECORD_SEPARATOR) + RECORD_SEPARATOR : '',
    lang: language[lang] || lang || 'und',
    hierarchy: req.query.hierarchy ? 1 : 0
  }

  // perform query
  // console.time('took')
  const rows = service.module.pip.statement.verbose.all(query)
  // console.timeEnd('took')

  // rewrite response to emulate 'wof-admin-lookup' format
  let resp = {}
  rows.forEach(row => {
    const name = row.name_localized || row.name || undefined

    let nameAlias = []
    if (query.aliaslimit > 0) { nameAlias = (row.names || '').split(String.fromCharCode(30)) }
    nameAlias = (nameAlias.length > 1) ? nameAlias.filter(n => n !== name).slice(0, query.aliaslimit) : undefined

    let abbrAlias = []
    if (query.aliaslimit > 0) { abbrAlias = (row.abbrs || '').split(String.fromCharCode(30)) }
    abbrAlias = (abbrAlias.length > 1) ? abbrAlias.filter(n => n !== name).slice(0, query.aliaslimit) : undefined

    let hierarchy = {}
    if (query.hierarchy) {
      hierarchy = _.mapValues(
        JSON.parse(row.hierarchy || '{}'),
        (parent) => {
          _.assign(parent, boundsAndCentroid(parent))
          delete parent.bounds
          return parent
        }
      )
    }

    if (!Array.isArray(resp[row.type])) { resp[row.type] = [] }
    resp[row.type].push({
      id: row.id,
      source: row.source,
      name,
      name_alias: nameAlias,
      abbr: row.abbr || undefined,
      abbr_alias: abbrAlias,
      ...boundsAndCentroid(row),
      hierarchy,
      distance: util.floatPrecision7(row.distance)
    })
  })

  // allow other views to utilize this view
  if (typeof this.remap === 'function') {
    resp = this.remap(resp, req, res)
  }

  // send json
  res.status(200).json(resp)
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
