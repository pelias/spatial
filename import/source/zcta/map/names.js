const _ = require('lodash')
const Name = require('../../../../model/Name')

function mapper (place, properties) {
  // generic name properties
  place.addName(new Name('und', 'default', false, _.get(properties, 'ZCTA5CE20', '').trim()))
}

module.exports = mapper
