const util = require('./util')

module.exports.intersects = function (req, res) {
  var service = req.app.locals.service

  let limit = parseInt(req.query.limit, 10)
  if (!limit) { limit = 100 }
  if (limit > 500) { limit = 500 }

  // inputs
  let query = {
    source: util.flatten(req.params.source),
    id: util.flatten(req.params.id),
    limit: limit
  }

  // perform query
  // console.time('took')
  let row = service.module.relationship.statement.intersects.all(query)
  // console.timeEnd('took')

  // send json
  res.status(200).json(row)
}

module.exports.contains = function (req, res) {
  var service = req.app.locals.service

  let limit = parseInt(req.query.limit, 10)
  if (!limit) { limit = 100 }
  if (limit > 500) { limit = 500 }

  // inputs
  let query = {
    source: util.flatten(req.params.source),
    id: util.flatten(req.params.id),
    limit: limit
  }

  // perform query
  // console.time('took')
  let row = service.module.relationship.statement.contains.all(query)
  // console.timeEnd('took')

  // send json
  res.status(200).json(row)
}

module.exports.within = function (req, res) {
  var service = req.app.locals.service

  let limit = parseInt(req.query.limit, 10)
  if (!limit) { limit = 100 }
  if (limit > 500) { limit = 500 }

  // inputs
  let query = {
    source: util.flatten(req.params.source),
    id: util.flatten(req.params.id),
    limit: limit
  }

  // perform query
  // console.time('took')
  let row = service.module.relationship.statement.within.all(query)
  // console.timeEnd('took')

  // send json
  res.status(200).json(row)
}
