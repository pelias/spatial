const Property = require('../../../../model/Property')

function mapper (place, properties) {
  for (let key in properties) {
    place.addProperty(new Property(`statcan:${key}`, properties[key]))
  }
}

module.exports = mapper
