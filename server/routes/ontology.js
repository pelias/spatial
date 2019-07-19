const util = require('./util')

module.exports = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    class: util.flatten(req.params.class),
    type: util.flatten(req.params.type),
    limit: 100
  }

  // perform query
  console.time('took')
  let rows = service.module.place.statement.ontology.all(query)
  console.timeEnd('took')

  // send json
  res.status(200).json(rows)
}
