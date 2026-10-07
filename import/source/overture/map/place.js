const _ = require('lodash')
const Identity = require('../../../../model/Identity')
const Ontology = require('../../../../model/Ontology')
const Place = require('../../../../model/Place')

const map = {
  properties: require('./properties'),
  names: require('./names'),
  hierarchies: require('./hierarchies'),
  geometries: require('./geometries')
}

// unified mapper for all Overture themes
function mapper (doc) {
  // get document properties
  const properties = _.get(doc, 'properties')
  if (!_.isPlainObject(properties)) { return null }

  // require a valid ID
  const id = _.get(doc, 'id', '').toString()
  if (!id) { return null }

  // require a primary name
  const primaryName = _.get(properties, 'names.primary')
  if (!primaryName || !primaryName.trim()) { return null }

  // get subtype for ontology
  const subtype = _.get(properties, 'subtype', 'unknown')

  // instantiate a new place
  const place = new Place(
    new Identity('overture', id),
    new Ontology('admin', subtype)
  )

  // run mappers
  map.properties(place, properties)
  map.names(place, properties)

  // hierarchies only exist in division theme, not division_area
  if (properties.hierarchies) {
    map.hierarchies(place, properties)
  }

  map.geometries(place, doc)

  return place
}

module.exports = mapper
