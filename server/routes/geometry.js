const _ = require('lodash')
const util = require('./util')
const format = require('../../import/format')

module.exports.all = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    source: util.flatten(req.params.source),
    id: util.flatten(req.params.id),
    role: util.flatten(req.query.role),
    simplify: parseFloat(util.flatten(req.query.simplify)),
    limit: 100
  }

  // select output format
  let fmt = util.flatten(_.get(req, 'query.format', 'geojson'))
  if (!_.has(format.formats, fmt.trim().toUpperCase())) {
    return res.status(400).json({
      error: 'invalid format',
      description: `supported: ${Object.keys(format.formats)}`
    })
  }

  // perform query
  // console.time('took')
  let rows = service.module.geometry.statement.fetch.all(query)
  // console.timeEnd('took')

  // shift format
  rows = rows.map(row => {
    if (row && row.geom) {
      row.geom = format.to(format.from('geometry', 'wkb', row.geom), fmt)
    }
    return row
  })

  // send json
  res.status(200).json(rows)
}

module.exports.one = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    source: util.flatten(req.params.source),
    id: util.flatten(req.params.id),
    role: util.flatten(req.query.role),
    simplify: parseFloat(util.flatten(req.query.simplify)),
    limit: 100
  }

  // select output format
  let fmt = util.flatten(_.get(req, 'query.format', 'geojson'))
  if (!_.has(format.formats, fmt.trim().toUpperCase())) {
    return res.status(400).json({
      error: 'invalid format',
      description: `supported: ${Object.keys(format.formats)}`
    })
  }

  // perform query
  // console.time('took')
  let row = service.module.geometry.statement.fetch.get(query)
  // console.timeEnd('took')

  // shift format
  if (row && row.geom) {
    row.geom = format.to(format.from('geometry', 'wkb', row.geom), fmt)
  }

  // send json
  res.status(200).json(row)
}
