// function returns the preferred buffer radius for a placetype
const _ = require('lodash')

function radius (place) {
  const _type = _.get(place, 'ontology.type', '').trim().toUpperCase()

  switch (_type) {
    case 'BOROUGH': return 0.02
    case 'LOCALITY': return 0.02
    case 'LOCALADMIN': return 0.02
    case 'REGION': return 0.02
    case 'CAMPUS': return 0.02
  }

  return 0.01
}

module.exports = radius
