const _ = require('lodash')
const spec = require('../config/whosonfirst-spec')
const Identity = require('../../../../model/Identity')
const Hierarchy = require('../../../../model/Hierarchy')

// sort hierarchy object so keys are in ascending order by rank
function sortHierarchy (hierarchy) {
  return _(hierarchy)
    .toPairs()
    .sortBy(([k]) => {
      const placetype = spec.names.get(k.replace('_id', ''))
      return placetype ? placetype.rank : 0
    })
    .reverse()
    .fromPairs()
    .value()
}

function mapper (place, properties) {
  const hierarchies = _.get(properties, 'wof:hierarchy', [])
  const id = parseInt(place.identity.id, 10)

  hierarchies.forEach((hierarchy, o) => {
    // sort hierarchy and ensure self-reference exists
    // note: place.ontology.type is used directly (rather than looking it up
    // via spec.names) so that records with a placetype not present in the
    // spec file (eg. a WOF placetype spatial doesn't support yet) still get
    // a self-reference instead of crashing - sortHierarchy() already treats
    // unrecognised placetypes as rank 0.
    const sorted = sortHierarchy({ ...hierarchy, ...{ [`${place.ontology.type}_id`]: id } })

    let depth = 0
    for (const key in sorted) {
      const parentId = sorted[key].toString()
      if (parentId === '-1') { continue }

      place.addHierarchy(
        new Hierarchy(
          place.identity,
          new Identity(
            place.identity.source,
            parentId
          ),
          `wof:${o}`,
          depth++
        )
      )
    }
  })
}

module.exports = mapper
