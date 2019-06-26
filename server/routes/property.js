module.exports = function (req, res) {
  // service
  var service = req.app.locals.service

  // inputs
  let query = {
    source: req.params.source,
    id: req.params.id,
    limit: 100
  }

  // perform query
  console.time('took')
  let rows = service.module.property.statement.fetch.all(query)
  console.timeEnd('took')

  // send json
  res.status(200).json(rows)
}
