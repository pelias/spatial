const _ = require('lodash')
const Property = require('../../../../model/Property')

function mapper (place, properties) {
  // generic properties
  place.addProperty(new Property('name', _.get(properties, 'name', '').trim()))

  // country codes
  // https://wiki.openstreetmap.org/wiki/Country_code

  // ISO 3166-1
  let alpha2 = new Property('alpha2', _.get(properties, 'ISO3166-1:alpha2', 'XX').trim().toUpperCase())
  let alpha3 = new Property('alpha3', _.get(properties, 'ISO3166-1:alpha3', '').trim().toUpperCase())

  // ISO 3166-2
  let subdivision = _.get(properties, 'ISO3166-2', '').trim().toUpperCase()
  let parts = subdivision.split('-')
  if (parts.length === 2 && parts[0].length === 2) {
    if (alpha2.value === 'XX') {
      alpha2.setValue(parts[0])
    }
    place.addProperty(new Property('alpha2_region', parts[1]))
  }

  place.addProperty(alpha2)
  place.addProperty(alpha3)

  // osm-specific properties
  const picked = _.pickBy(properties, (val, key) => {
    if (key.startsWith('@')) { return false }
    if (key === 'name') { return false }
    if (key.startsWith('name:')) { return false }
    if (key.startsWith('alt_name')) { return false }
    if (key.startsWith('ISO3166-1:alpha')) { return false }
    if (key.startsWith('ISO3166-2')) { return false }
    return true
  })
  for (let key in picked) {
    place.addProperty(new Property(`osm:${key}`, picked[key]))
  }
}

module.exports = mapper
