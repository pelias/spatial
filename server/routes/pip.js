module.exports = function (req, res) {
  // service
  var service = req.app.locals.service

  // inputs
  let query = {
    lon: parseFloat(req.query.lon),
    lat: parseFloat(req.query.lat),
    limit: 1000
  }

  // perform query
  console.time('took')
  let rows = service.module.pip.statement.pip.all(query)
  console.timeEnd('took')

  // send json
  res.status(200).json(rows)
}
