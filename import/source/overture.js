const file = require('../../import/file')

// unified mapper for all Overture themes
module.exports = {
  ingress: file,
  record_separator: /\r?\n/,
  format: 'json',
  mapper: require('./overture/map/place')
}
