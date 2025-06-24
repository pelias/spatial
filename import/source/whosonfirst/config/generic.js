const _ = require('lodash')

/**
 * This file provides some convenience functions for finding the 'generic name'
 * and 'generic abbreviation' of a WOF document.
 *
 * This should probably be a lot easier than it is, and there seems to be some
 * inconsistency within the Pelias codebase about which fields to prefer in
 * certain cases.
 *
 * I've made a best-effort attempt to honour the field mappings which are (at time of writing)
 * being used the pelias/wof-admin-lookup module.
 * The idea is that this repo can be used as a drop-in replacement for wof-admin-lookup.
 *
 * Prior work:
 * [N1] https://github.com/pelias/wof-admin-lookup/blob/e7ea48af6eb5b2b88886dd4b4f71a81e6e38696a/src/pip/components/getDefaultName.js
 * [A1] https://github.com/pelias/wof-admin-lookup/blob/d9abfe32ed40184bd657df463e2faeb6ff2f7326/src/pip/components/extractFields.js#L44-L51
 * [A2] https://github.com/pelias/whosonfirst/blob/fee549816a8a29fc5c3daccc66129677f8d552d6/src/components/extractFields.js#L154
 */

// convenience function to find a generic name for the place
function getName (properties) {
  const placeType = _.get(properties, 'wof:placetype')
  const ISOcountry = _.get(properties, 'iso:country')
  const quattroAlt = _.get(properties, 'qs:a2_alt')
  const label = _.get(properties, 'wof:label')
  const name = _.get(properties, 'wof:name')

  // this US-county specific logic was ported from [A1]
  if (ISOcountry === 'US' && placeType === 'county' && quattroAlt) {
    return quattroAlt.trim()
  }

  // use label
  if (label) { return label.trim() }

  // use name
  if (name) { return name.trim() }
}

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
  name: getName,
  abbreviation: getAbbreviation
}
