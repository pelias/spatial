
const util = require('./util')

module.exports.place = function (req, res) {
  let params = {
    source: util.flatten(req.params.source),
    id: util.flatten(req.params.id)
  }

  res.render('pages/place', {
    layout: 'default',
    params: params
  })
}
