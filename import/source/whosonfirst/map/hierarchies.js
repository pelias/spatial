const _ = require('lodash')
const spec = require('../config/whosonfirst-spec')
const Identity = require('../../../../model/Identity')
const Hierarchy = require('../../../../model/Hierarchy')

function mapper (place, properties) {
  let hierarchies = _.get(properties, 'wof:hierarchy', [])
  let pt = spec.names.get(place.ontology.type)
  let validParentPlaceTypes = spec.parents(place.ontology.type).reduce((memo, item) => {
    memo[item.name] = item
    return memo
  }, {})

  hierarchies.forEach((hierarchy, o) => {
    for (let key in hierarchy) {
      let placetype = key.replace('_id', '')
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
      // only take the first (should be the lowest level?) parent
      // ensures we only get a max of one parent per hierarchy
      break
    }
  })
}

module.exports = mapper
