const _ = require('lodash')
const Property = require('../../../../model/Property')

function mapper (place, properties) {
  // generic properties
  place.addProperty(new Property('alpha2', _.get(properties, 'wof:country', 'XX').toUpperCase()))
  place.addProperty(new Property('alpha3', _.get(properties, 'wof:country_alpha3', '').toUpperCase()))
  place.addProperty(new Property('modified', _.get(properties, 'wof:lastmodified', '').toString()))

  // wof-specific properties
  const picked = _.pickBy(properties, (val, key) => {
    if (!key.startsWith('wof:') && !key.startsWith('src:')) { return false }
    if (!_.isString(val) && !_.isNumber(val)) { return false }
    if (key === 'wof:id') { return false }
    if (key === 'wof:name') { return false }
    if (key === 'wof:parent_id') { return false }
    if (key === 'wof:placetype') { return false }
    if (key === 'wof:geomhash') { return false }
    if (key === 'wof:country') { return false }
    if (key === 'wof:country_alpha3') { return false }
    if (key === 'wof:lastmodified') { return false }
    return true
  })
  for (let key in picked) {
    let val = picked[key]
    if (typeof val.toString === 'function') { val = val.toString() }
    place.addProperty(new Property(`${key}`, val))
  }
}

module.exports = mapper
