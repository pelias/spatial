const util = require('./util')

module.exports = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    name: util.flatten(req.query.name),
    limit: 100
  }

  // perform query
  console.time('took')
  let rows = service.module.name.statement.search.all(query)
  console.timeEnd('took')

  // send json
  res.status(200).json(rows)
}
