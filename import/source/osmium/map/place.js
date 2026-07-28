const _ = require('lodash')
const DELIM = ':'
const scalar = require('../config/scalar')
const Identity = require('../../../../model/Identity')
const Ontology = require('../../../../model/Ontology')
const Place = require('../../../../model/Place')

const map = {
  properties: require('./properties'),
  names: require('./names'),
  geometries: require('./geometries')
}

// OSM tag values which name the same concept as a Who's on First placetype but
// spell it differently. Normalizing here means downstream consumers only need
// to know the WOF vocabulary; without this, `boundary=postal_code` records are
// filtered out of the /query/pip/_view/pelias view, whose layer whitelist uses
// the WOF spelling 'postalcode'.
const ONTOLOGY_TYPE_ALIASES = {
  postal_code: 'postalcode'
}

function mapper (doc) {
  // get document properties
  const properties = _.get(doc, 'properties')
  if (!_.isPlainObject(properties)) { return null }

  // instantiate a new place
  const place = new Place(
    new Identity('osm', _.get(properties, '@type') + DELIM + _.get(properties, '@id')),
    new Ontology('admin', scalar(_.get(properties, 'place', 'unknown')))
  )

  // try to avoid 'unknown' ontology type
  if (place.ontology.type === 'unknown') {
    // use 'landuse' property if available
    place.ontology.setType(scalar(_.get(properties, 'landuse', 'unknown').trim().toLowerCase()))

    // use 'boundary' property if available
    if (place.ontology.type === 'unknown') {
      const boundary = scalar(_.get(properties, 'boundary', 'unknown').trim().toLowerCase())
      if (boundary !== 'multipolygon') { place.ontology.setType(boundary) }
    }
  }

  // normalize OSM spellings to their Who's on First equivalents
  if (_.has(ONTOLOGY_TYPE_ALIASES, place.ontology.type)) {
    place.ontology.setType(ONTOLOGY_TYPE_ALIASES[place.ontology.type])
  }

  // run mappers
  map.properties(place, properties)
  map.names(place, properties)
  map.geometries(place, doc)

  return place
}

module.exports = mapper
