const _ = require('lodash')
const util = require('./util')
const MIN_PAGE = 1
const MAX_PAGE = 1000

module.exports = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    class: util.flatten(req.params.class),
    type: util.flatten(req.params.type),
    limit: 50
  }

  // pagination
  const page = parseInt(util.flatten(req.query.page))
  if (_.isFinite(page) && _.inRange(page, MIN_PAGE, MAX_PAGE)) {
    query.offset = (page - 1) * query.limit
  }

  // perform query
  // console.time('took')
  let rows = service.module.place.statement.ontology.all(query)
  // console.timeEnd('took')

  // send json
  res.status(200).json(rows)
}
