const util = require('./util')

module.exports = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    source: util.flatten(req.params.source),
    id: util.flatten(req.params.id)
  }

  // perform query
  // console.time('took')
  let rows = service.module.place.statement.fetch.get(query)
  // console.timeEnd('took')

  // send json
  res.status(200).json(rows)
}
