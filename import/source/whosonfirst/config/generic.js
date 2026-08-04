const _ = require('lodash')

// convenience function to find a generic abbreviation for the place
function getAbbreviation (properties) {
  const placeType = _.get(properties, 'wof:placetype')
  const countryCode = _.get(properties, 'wof:country_alpha3')
  const admin3 = _.get(properties, 'qs:adm0_a3', _.get(properties, 'ne:adm0_a3'))
  const shortCode = _.get(properties, 'wof:shortcode')
  const abbreviation = _.get(properties, 'wof:abbreviation')
  const country = _.get(properties, 'wof:country')

  // use the 3 letter country code for 'country' and 'dependency' placetypes
  if (['country', 'dependency'].includes(placeType)) {
    if (countryCode) { return countryCode.trim() }
    if (admin3) { return admin3.trim() }
  }

  // use shortcode
  if (shortCode) { return shortCode.trim() }

  // use abbreviation
  if (abbreviation) { return abbreviation.trim() }

  // support the deprecated 'wof:country' field
  if (placeType === 'dependency' && country) {
    return country.trim()
  }
}

module.exports = {
  abbreviation: getAbbreviation
}
