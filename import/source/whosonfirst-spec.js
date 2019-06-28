let spec = require('./placetypes-spec-latest.json')

let ids = new Map()
let names = new Map()

for (let id in spec) {
  spec[id].id = parseInt(id, 10) // assign id
  ids.set(spec[id].id, spec[id])
  names.set(spec[id].name, spec[id])
}

function rank () {
  let placetypes = Array.from(ids.values())

  // assign ranks
  while (!placetypes.every(pt => pt.hasOwnProperty('rank'))) {
    placetypes.forEach(pt => {
      // already ranked
      if (pt.hasOwnProperty('rank')) { return }

      // pt has 0 parents
      if (!pt.parent.length) {
        pt.rank = 0
        return
      }

      // not all parents have been ranked yet
      if (!pt.parent.every(pid => ids.get(pid).hasOwnProperty('rank'))) { return }

      // find the highest parent rank
      let parentRanks = pt.parent.map(pid => ids.get(pid).rank)
      let maxParentRank = Math.max.apply(null, parentRanks)

      // assign rank one higher than highest parent
      pt.rank = maxParentRank + 1
    })
  }
}
rank()

// ensure that parent arrays are sorted by rank
function sortParents () {
  Array.from(ids.values()).forEach(pt => {
    pt.parent = pt.parent.sort((a, b) => b.rank - a.rank)
  })
}
sortParents()

function parents (placetype) {
  if (!names.has(placetype)) { return [] }
  return names.get(placetype).parent.map(id => ids.get(id))
}

module.exports = {
  spec: spec,
  ids: ids,
  names: names,
  parents: parents
}
