const _ = require('lodash')
const DELIM = ':'
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
    new Identity('osm', _.get(properties, '@type') + DELIM + _.get(properties, '@id')),
    new Ontology('admin', _.get(properties, 'place', 'unknown'))
  )

  // try to avoid 'unknown' ontology type
  if (place.ontology.type === 'unknown') {
    // use 'landuse' property if available
    place.ontology.setType(_.get(properties, 'landuse', 'unknown').trim().toLowerCase())

    // use 'boundary' property if available
    if (place.ontology.type === 'unknown') {
      const boundary = _.get(properties, 'boundary', 'unknown').trim().toLowerCase()
      if (boundary !== 'multipolygon') { place.ontology.setType(boundary) }
    }
  }

  // run mappers
  map.properties(place, properties)
  map.names(place, properties)
  map.geometries(place, doc)

  return place
}

module.exports = mapper
