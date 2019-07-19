const _ = require('lodash')
const format = require('../../../format')
const Identity = require('../../../../model/Identity')
const Ontology = require('../../../../model/Ontology')
const Place = require('../../../../model/Place')

const map = {
  properties: require('./properties'),
  names: require('./names'),
  hierarchies: require('./hierarchies')
}

function mapper (doc) {
  // get document properties
  const properties = _.get(doc, 'properties')
  if (!_.isPlainObject(properties)) { return null }

  // do not map non-current, deprecated or superseded documents
  if (!_isValid(properties)) { return null }

  // instantiate a new place
  const place = new Place(
    new Identity('wof', _.get(doc, 'id', '').toString()),
    new Ontology('admin', _.get(properties, 'wof:placetype', 'unknown').trim().toLowerCase().split(/\s+/).join('_'))
  )

  // add geometry
  const geometry = _.get(doc, 'geometry')
  if (geometry) {
    place.addGeometry(format.from('geometry', 'geojson', geometry))
  }

  // run mappers
  map.properties(place, properties)
  map.names(place, properties)
  map.hierarchies(place, properties)

  return place
}

function _isValid (properties) {
  let isCurrent = _.get(properties, 'mz:is_current') !== 0
  let isDeprecated = !!_.trim(properties['edtf:deprecated'] || '').length
  let isSuperseded = _.isArray(_.get(properties, 'wof:superseded_by')) &&
    properties['wof:superseded_by'].length > 0
  return isCurrent && !isDeprecated && !isSuperseded
}

module.exports = mapper
