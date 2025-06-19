const util = require('./util')

module.exports = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    source: util.flatten(req.params.source),
    id: util.flatten(req.params.id),
    limit: 100
  }

  // perform query
  // console.time('took')
  let rows = service.module.name.statement.fetch.all(query)
  // console.timeEnd('took')

  // send json
  res.status(200).json(rows)
}
