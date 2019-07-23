const util = require('./util')

// a custom 'view' which emulates the legacy pelias PIP format
// see: https://github.com/pelias/wof-admin-lookup
module.exports = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    lon: parseFloat(util.flatten(req.params.lon)),
    lat: parseFloat(util.flatten(req.params.lat)),
    limit: 1000
  }

  // perform query
  console.time('took')
  let rows = service.module.pip.statement.pip_pelias.all(query)
  console.timeEnd('took')

  // rewrite response to emulate 'wof-admin-lookup' format

  // only 'whosonfirst' source expected
  // rows = rows.filter(row => row.source === 'wof')

  // send json
  res.status(200).json(rows)
}
