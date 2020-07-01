const _ = require('lodash')
const Identity = require('../../../../model/Identity')
const Ontology = require('../../../../model/Ontology')
const Place = require('../../../../model/Place')

const map = {
  names: require('./names'),
  geometries: require('./geometries')
}

function mapper (doc) {
  // get document properties
  const properties = _.get(doc, 'properties')
  if (!_.isPlainObject(properties)) { return null }

  // do not map records with no valid name
  if (_.size(properties.names) < 1) { return null }

  // instantiate a new place
  const place = new Place(
    new Identity('0sv', _.get(properties, 'id', '').toString()),
    new Ontology('street', _.get(properties, 'ontology.type', 'unknown'))
  )

  // run mappers
  map.names(place, properties)
  map.geometries(place, doc)

  return place
}

module.exports = mapper
