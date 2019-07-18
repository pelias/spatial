const _ = require('lodash')
const Property = require('../../../../model/Property')

function mapper (place, properties) {
  // generic properties
  place.addProperty(new Property('alpha2', _.get(properties, 'wof:country', 'XX').toUpperCase()))
  place.addProperty(new Property('alpha3', _.get(properties, 'wof:country_alpha3', '').toUpperCase()))
  place.addProperty(new Property('name', _.get(properties, 'wof:name')))
  place.addProperty(new Property('abbr', _.get(properties, 'wof:abbreviation')))
  place.addProperty(new Property('modified', _.get(properties, 'wof:lastmodified', '').toString()))

  // wof-specific properties
  place.addProperty(new Property('wof:shortcode', _.get(properties, 'wof:shortcode', '').toUpperCase()))
  place.addProperty(new Property('wof:repo', _.get(properties, 'wof:repo')))
}

module.exports = mapper
