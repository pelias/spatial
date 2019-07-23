const _ = require('lodash')
const Property = require('../../../../model/Property')

function mapper (place, properties) {
  const picked = _.pickBy(properties, (val, key) => {
    if (key.startsWith('INTPT')) { return false }
    return true
  })

  for (let key in picked) {
    place.addProperty(new Property(`uscensus:${key}`, picked[key]))
  }
}

module.exports = mapper
