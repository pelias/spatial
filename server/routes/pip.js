const util = require('./util')

module.exports = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    lon: parseFloat(util.flattten(req.query.lon)),
    lat: parseFloat(util.flattten(req.query.lat)),
    limit: 1000
  }

  // perform query
  console.time('took')
  let rows = service.module.pip.statement.pip.all(query)
  console.timeEnd('took')

  // send json
  res.status(200).json(rows)
}
