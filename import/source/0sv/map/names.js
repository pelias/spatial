const _ = require('lodash')
const Name = require('../../../../model/Name')

function mapper (place, properties) {
  _.forEach(properties.names, name => {
    place.addName(new Name('und', 'default', false, name))
  })
}

module.exports = mapper
