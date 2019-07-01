const _ = require('lodash')
const format = require('../format')
const spec = require('./whosonfirst-spec')

const mapping = {
  'source': () => 'wof',
  'source_id': 'id',
  'class': () => 'admin',
  'type': (record) => _.get(record, 'properties.wof:placetype'),
  'geometry': (record) => format.from('geometry', 'geojson', record.geometry),
  'valid': (record) => {
    let isCurrent = _.get(record, 'properties.mz:is_current') !== 0
    let isDeprecated = !_.isEmpty(_.trim(record.properties['edtf:deprecated']))
    let isSuperseded = _.isArray(_.get(record, 'properties.wof:superseded_by')) &&
        record.properties['wof:superseded_by'].length > 0
    return isCurrent && !isDeprecated && !isSuperseded
  },
  'property': (record) => {
    return {
      'alpha2': _.get(record, 'properties.wof:country', 'XX').toUpperCase(),
      'alpha3': _.get(record, 'properties.wof:country_alpha3', '').toUpperCase(),
      'shortcode': _.get(record, 'properties.wof:shortcode', '').toUpperCase(),
      'name': _.get(record, 'properties.wof:name'),
      'abbr': _.get(record, 'properties.wof:abbreviation'),
      'repo': _.get(record, 'properties.wof:repo')
    }
  },
  'hierarchy': (record, mapped) => {
    let hierarchy = []
    let wofHierarchies = _.get(record, 'properties.wof:hierarchy', [])
    let pt = spec.names.get(mapped.type)
    let validParentPlaceTypes = spec.parents(mapped.type).reduce((memo, item) => {
      memo[item.name] = item
      return memo
    }, {})
    wofHierarchies.forEach((wofHierarchy, o) => {
      let branch = `wof:${o}`
      for (let key in wofHierarchy) {
        let _placetype = key.replace('_id', '')
        if (!validParentPlaceTypes.hasOwnProperty(_placetype)) { continue } // not a valid parent type
        if (validParentPlaceTypes[_placetype].name === pt.name) { continue } // same placetype
        if (validParentPlaceTypes[_placetype].rank >= pt.rank) { continue } // same or less granular
        hierarchy.push({
          child_source: mapped.source.toString(),
          child_id: mapped.source_id.toString(),
          parent_source: mapped.source.toString(),
          parent_id: wofHierarchy[key].toString(),
          branch: branch
        })
        // only take the first (should be the lowest level?) parent
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
