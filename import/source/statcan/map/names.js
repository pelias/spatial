const _ = require('lodash')
const Name = require('../../../../model/Name')

function mapper (place, properties) {
  // generic name properties
  place.addName(new Name('eng', 'default', false, _.get(properties, 'CDNAME', '').trim()))
}

module.exports = mapper
