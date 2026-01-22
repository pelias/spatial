const file = require('../../import/file')

module.exports = {
  ingress: file,
  format: 'csv',
  mapper: require('./onspd/map/place')
}
