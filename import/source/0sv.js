const file = require('../../import/file')

module.exports = {
  ingress: file,
  record_separator: /\r?\n/,
  format: '0sv',
  mapper: require('./0sv/map/place')
}
