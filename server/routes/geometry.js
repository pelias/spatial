const format = require('../../import/format')

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
  let rows = service.module.geometry.statement.fetch.all(query)
  console.timeEnd('took')

  // shift format
  rows = rows.map(row => {
    row.geom = format.to(format.from('geometry', 'wkb', row.geom), 'geojson')
    return row
  })

  // send json
  res.status(200).json(rows)
}
