const _ = require('lodash')
const Identity = require('../../../../model/Identity')
const Ontology = require('../../../../model/Ontology')
const Place = require('../../../../model/Place')

const map = {
  names: require('./names'),
  properties: require('./properties'),
  geometries: require('./geometries')
}

function mapper (doc) {
  // get document properties
  const properties = _.get(doc, 'properties')
  if (!_.isPlainObject(properties)) { return null }

  // do not map records with no valid id or name
  if (!_.has(properties, 'SSC_CODE16')) { return null }
  if (!_.has(properties, 'SSC_NAME16')) { return null }

  // instantiate a new place
  const place = new Place(
    new Identity('asgs', _.get(properties, 'SSC_CODE16', '').toString()),
    new Ontology('admin', 'suburb')
  )

  // run mappers
  map.names(place, properties)
  map.properties(place, properties)
  map.geometries(place, doc)

  return place
}

module.exports = mapper
