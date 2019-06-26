module.exports = function (req, res) {
  // service
  var service = req.app.locals.service

  // inputs
  let query = {
    source: req.params.source,
    id: req.params.id
  }

  // perform query
  console.time('took')
  let rows = service.module.document.statement.fetch.get(query)
  console.timeEnd('took')

  // send json
  res.status(200).json(rows)
}
