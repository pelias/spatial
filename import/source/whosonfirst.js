const _ = require('lodash')
const format = require('../format')

const WhosOnFirstSpec = require('./WhosOnFirstSpec')
const spec = new WhosOnFirstSpec()

const mapping = {
  'source': () => 'wof',
  'source_id': 'id',
  'class': () => 'admin',
  'type': (record) => _.get(record, 'properties.wof:placetype'),
  'geometry': (record) => format.from('geometry', 'geojson', record.geometry),
  'property': (record) => {
    return {
      'alpha2': _.get(record, 'properties.wof:country', 'XX').toUpperCase(),
      'name': _.get(record, 'properties.wof:name')
      // 'wof:repo': _.get(record, 'properties.wof:repo')
      // 'wof:lastmodified': _.get(record, 'properties.wof:lastmodified')
    }
  },
  'hierarchy': (record, mapped) => {
    let hierarchy = []
    let wofHierarchies = _.get(record, 'properties.wof:hierarchy', [])
    let validParentPlaceTypes = spec.parents(mapped.type).reduce((memo, item) => {
      memo[item.name] = item
      return memo
    }, {})
    wofHierarchies.forEach((wofHierarchy, o) => {
      let branch = `wof:${o}`
      for (let key in wofHierarchy) {
        let pt = key.replace('_id', '')
        if (!validParentPlaceTypes.hasOwnProperty(pt)) { continue }
        hierarchy.push({
          child_source: mapped.source.toString(),
          child_id: mapped.source_id.toString(),
          parent_source: mapped.source.toString(),
          parent_id: wofHierarchy[key].toString(),
          branch: branch
        })
        // only take the first (should be the lowest leevel?) parent
        // ensures we only get a max of one parent per hierarchy
        break
      }
    })
    return hierarchy
  }
}

module.exports = {
  ingress: process.stdin,
  record_separator: /\r?\n/,
  format: 'json',
  mapping: mapping
}
