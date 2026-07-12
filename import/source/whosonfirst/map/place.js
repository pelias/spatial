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

function mapper (doc) {
  // get document properties
  const properties = _.get(doc, 'properties')
  if (!_.isPlainObject(properties)) { return null }

  // do not map non-current, deprecated or superseded documents
  if (!_isValid(properties)) { return null }

  // do not import alt-geometries (we may wish to in the future)
  if (_isAltGeometry(properties)) { return null }

  // ensure all required fields are present
  if (!_hasRequiredFields(properties)) { return null }

  // skip neighbourhoods with invalid hierarchies
  if (_isNeighbourhoodWithInvalidHierarchy(properties)) { return null }

  // instantiate a new place
  const place = new Place(
    new Identity('wof', _.get(doc, 'id', '').toString()),
    new Ontology('admin', _.get(properties, 'wof:placetype', 'unknown'))
  )

  // run mappers
  map.properties(place, properties)
  map.names(place, properties)
  map.hierarchies(place, properties)
  map.geometries(place, doc)

  return place
}

// note: these semantics intentionally match placeholder's isValidWofRecord()
// so that both services agree on which records exist, see:
// https://github.com/pelias/placeholder/blob/master/prototype/wof.js
function _isValid (properties) {
  // non-current records; the value may be a number or a string.
  // -1 signifies an indeterminate state and is considered current
  const current = _.get(properties, 'mz:is_current')
  const isCurrent = !(current === 0 || current === '0')

  // deprecated records; the value 'uuuu' signifies an unknown
  // date and is not considered a deprecation
  const deprecated = _.trim(properties['edtf:deprecated'] || '')
  const isDeprecated = !!deprecated.length && deprecated !== 'uuuu'

  const isSuperseded = _.isArray(_.get(properties, 'wof:superseded_by')) &&
    properties['wof:superseded_by'].length > 0

  return isCurrent && !isDeprecated && !isSuperseded
}

function _hasRequiredFields (properties) {
  return !_.isEmpty(_.get(properties, 'wof:name', '').trim())
}

// This functionality was inherited from 'wof-admin-lookup'.
// We need to revisit this at some point as looking through the data revealed a bunch of
// issues with hierarchies including `locality_id = -1`, `locality_id = neighbourhood_id` &
// `locality_id = <deprecated/superseded>`.
function _isNeighbourhoodWithInvalidHierarchy (properties) {
  let placetype = _.get(properties, 'wof:placetype', 'unknown')
  if (placetype !== 'neighbourhood') { return false }

  // https://github.com/pelias/wof-admin-lookup/blob/master/src/pip/components/filterOutCitylessNeighbourhoods.js
  let hierarchy = _.get(properties, 'wof:hierarchy', 'unknown')
  if (!_.has(hierarchy, '[0].locality_id') && !_.has(hierarchy, '[0].localadmin_id')) { return true }

  // https://github.com/pelias/wof-admin-lookup/blob/master/src/pip/components/filterOutHierarchylessNeighbourhoods.js
  return _.isEmpty(hierarchy)
}

function _isAltGeometry (properties) {
  return _.has(properties, 'src:alt_label')
}

module.exports = mapper
