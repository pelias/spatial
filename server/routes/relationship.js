const util = require('./util')

module.exports.intersects = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    source: util.flatten(req.params.source),
    id: util.flatten(req.params.id),
    limit: 100
  }

  // perform query
  console.time('took')
  let row = service.module.relationship.statement.intersects.all(query)
  console.timeEnd('took')

  // send json
  res.status(200).json(row)
}

module.exports.contains = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    source: util.flatten(req.params.source),
    id: util.flatten(req.params.id),
    limit: 100
  }

  // perform query
  console.time('took')
  let row = service.module.relationship.statement.contains.all(query)
  console.timeEnd('took')

  // send json
  res.status(200).json(row)
}

module.exports.within = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    source: util.flatten(req.params.source),
    id: util.flatten(req.params.id),
    limit: 100
  }

  // perform query
  console.time('took')
  let row = service.module.relationship.statement.within.all(query)
  console.timeEnd('took')

  // send json
  res.status(200).json(row)
}
