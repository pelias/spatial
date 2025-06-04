const _ = require('lodash')
const spec = require('../config/whosonfirst-spec')
const Identity = require('../../../../model/Identity')
const Hierarchy = require('../../../../model/Hierarchy')

// sort hierarchy object so keys are in ascending order by rank
function sortHierarchy (hierarchy) {
  return _(hierarchy)
    .toPairs()
    .sortBy(([k]) => spec.names.get(k.replace('_id', '')).rank || 0)
    .reverse()
    .fromPairs()
    .value()
}

function mapper (place, properties) {
  const hierarchies = _.get(properties, 'wof:hierarchy', [])
  const pt = spec.names.get(place.ontology.type)
  const validParentPlaceTypes = spec.parents(place.ontology.type).reduce((memo, item) => {
    memo[item.name] = item
    return memo
  }, {})

  hierarchies.forEach((hierarchy, o) => {
    for (const key in sortHierarchy(hierarchy)) {
      const placetype = key.replace('_id', '')
      if (!validParentPlaceTypes.hasOwnProperty(placetype)) { continue } // not a valid parent type
      if (validParentPlaceTypes[placetype].name === pt.name) { continue } // same placetype
      if (validParentPlaceTypes[placetype].rank >= pt.rank) { continue } // same or less granular

      place.addHierarchy(
        new Hierarchy(
          place.identity,
          new Identity(
            place.identity.source,
            hierarchy[key].toString()
          ),
          `wof:${o}`
        )
      )
      // only take the first (must be the lowest level) parent
      // ensures we only get a max of one parent per hierarchy
      break
    }
  })
}

module.exports = mapper
