const _ = require('lodash')
const Identity = require('../../../../model/Identity')
const Hierarchy = require('../../../../model/Hierarchy')

// map overture subtype to a rough rank for sorting
const subtypeRank = {
  'country': 1,
  'region': 2,
  'county': 3,
  'locality': 4,
  'localadmin': 5
}

function mapper (place, properties) {
  const hierarchies = _.get(properties, 'hierarchies', [])

  hierarchies.forEach((hierarchy, o) => {
    if (!_.isArray(hierarchy)) { return }

    // sort hierarchy by rank (country -> locality)
    const sorted = _.sortBy(hierarchy, item => {
      const subtype = _.get(item, 'subtype', '')
      return subtypeRank[subtype] || 99
    })

    let depth = 0
    sorted.forEach(item => {
      const divisionId = _.get(item, 'division_id')
      if (!divisionId) { return }

      place.addHierarchy(
        new Hierarchy(
          place.identity,
          new Identity('overture', divisionId),
          `hierarchy:${o}`,
          depth++
        )
      )
    })
  })
}

module.exports = mapper
