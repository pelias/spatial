const _ = require('lodash')
const Identity = require('../../../../model/Identity')
const Ontology = require('../../../../model/Ontology')
const Place = require('../../../../model/Place')

const map = {
  properties: require('./properties'),
  names: require('./names'),
  geometries: require('./geometries')
}

function mapper (doc) {
  // get document properties
  const properties = _.get(doc, 'properties')
  if (!_.isPlainObject(properties)) { return null }

  // instantiate a new place
  const place = new Place(
    new Identity('uscensus', _.get(properties, 'ZCTA5CE10', '').trim()),
    new Ontology('postalcode', 'zcta')
  )

  // run mappers
  map.properties(place, properties)
  map.names(place, properties)
  map.geometries(place, doc)

  return place
}

module.exports = mapper
