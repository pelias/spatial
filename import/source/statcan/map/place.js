const _ = require('lodash')
const Identity = require('../../../../model/Identity')
const Ontology = require('../../../../model/Ontology')
const Place = require('../../../../model/Place')

const map = {
  properties: require('./properties'),
  names: require('./names'),
  geometries: require('./geometries')
}

// {
//   "CSDUID": "5933045",
//   "CSDNAME": "Sun Peaks Mountain",
//   "CSDTYPE": "VL",
//   "PRUID": "59",
//   "PRNAME": "British Columbia / Colombie-Britannique",
//   "CDUID": "5933",
//   "CDNAME": "Thompson-Nicola",
//   "CDTYPE": "RD"
// }

function mapper (doc) {
  // get document properties
  const properties = _.get(doc, 'properties')
  if (!_.isPlainObject(properties)) { return null }

  // instantiate a new place
  const place = new Place(
    new Identity('statcan', _.get(properties, 'CDUID', '').trim()),
    new Ontology('admin', _.get(properties, 'CDTYPE', '').trim())
  )

  // run mappers
  map.properties(place, properties)
  map.names(place, properties)
  map.geometries(place, doc)

  return place
}

module.exports = mapper
