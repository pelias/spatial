const _ = require('lodash')
const Property = require('../../../../model/Property')

// unified properties mapper for all Overture themes
function mapper (place, properties) {
  // country code
  const country = _.get(properties, 'country', '')
  if (country) {
    place.addProperty(new Property('alpha2', country.toUpperCase()))
  }

  // region (division theme)
  const region = _.get(properties, 'region', '')
  if (region) {
    place.addProperty(new Property('region', region))
  }

  // subtype (locality, county, etc)
  const subtype = _.get(properties, 'subtype', '')
  if (subtype) {
    place.addProperty(new Property('subtype', subtype))
  }

  // admin_level (division_area theme)
  const adminLevel = _.get(properties, 'admin_level')
  if (_.isNumber(adminLevel)) {
    place.addProperty(new Property('admin_level', adminLevel.toString()))
  }

  // class
  const classValue = _.get(properties, 'class', '')
  if (classValue) {
    place.addProperty(new Property('class', classValue))
  }

  // population (division theme)
  const population = _.get(properties, 'population')
  if (_.isNumber(population)) {
    place.addProperty(new Property('population', population.toString()))
  }

  // cartography prominence (division theme)
  const prominence = _.get(properties, 'cartography.prominence')
  if (_.isNumber(prominence)) {
    place.addProperty(new Property('prominence', prominence.toString()))
  }

  // cartography min_zoom (division theme)
  const minZoom = _.get(properties, 'cartography.min_zoom')
  if (_.isNumber(minZoom)) {
    place.addProperty(new Property('min_zoom', minZoom.toString()))
  }

  // cartography max_zoom (division theme)
  const maxZoom = _.get(properties, 'cartography.max_zoom')
  if (_.isNumber(maxZoom)) {
    place.addProperty(new Property('max_zoom', maxZoom.toString()))
  }

  // cartography sort_key (division theme)
  const sortKey = _.get(properties, 'cartography.sort_key')
  if (_.isNumber(sortKey)) {
    place.addProperty(new Property('sort_key', sortKey.toString()))
  }

  // parent_division_id (division theme)
  const parentId = _.get(properties, 'parent_division_id')
  if (parentId) {
    place.addProperty(new Property('parent_division_id', parentId))
  }

  // division_id (division_area theme) - link back to the division point feature
  const divisionId = _.get(properties, 'division_id')
  if (divisionId) {
    place.addProperty(new Property('division_id', divisionId))
  }

  // is_land (division_area theme)
  const isLand = _.get(properties, 'is_land')
  if (_.isBoolean(isLand)) {
    place.addProperty(new Property('is_land', isLand.toString()))
  }

  // is_territorial (division_area theme)
  const isTerritorial = _.get(properties, 'is_territorial')
  if (_.isBoolean(isTerritorial)) {
    place.addProperty(new Property('is_territorial', isTerritorial.toString()))
  }

  // version
  const version = _.get(properties, 'version')
  if (_.isNumber(version)) {
    place.addProperty(new Property('version', version.toString()))
  }

  // local type
  const localType = _.get(properties, 'local_type')
  if (localType && _.isPlainObject(localType)) {
    const localTypeStr = Object.entries(localType)
      .map(([key, value]) => `${key}:${value}`)
      .join(',')

    if (localTypeStr) {
      place.addProperty(new Property('local_type', localTypeStr))
    }
  }

  // sources
  const sources = _.get(properties, 'sources', [])
  if (_.isArray(sources) && sources.length > 0) {
    const source = sources[0]
    const provider = _.get(source, 'provider', '')
    const dataset = _.get(source, 'dataset', '')
    const recordId = _.get(source, 'record_id', '')
    const resource = _.get(source, 'resource', '')
    const license = _.get(source, 'license', '')
    const updateTime = _.get(source, 'update_time', '')

    if (provider) {
      place.addProperty(new Property('source_provider', provider))
    }
    if (dataset) {
      place.addProperty(new Property('source_dataset', dataset))
    }
    if (recordId) {
      place.addProperty(new Property('source_record_id', recordId))
    }
    if (resource) {
      place.addProperty(new Property('source_resource', resource))
    }
    if (license) {
      place.addProperty(new Property('source_license', license))
    }
    if (updateTime) {
      place.addProperty(new Property('source_update_time', updateTime))
    }
  }
}

module.exports = mapper
