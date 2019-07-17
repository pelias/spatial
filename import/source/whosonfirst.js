const _ = require('lodash')
const format = require('../format')
const spec = require('./whosonfirst-spec')
const language = {
  alternatives: {
    'tib': 'bod',
    'cze': 'ces',
    'wel': 'cym',
    'ger': 'deu',
    'gre': 'ell',
    'baq': 'eus',
    'per': 'fas',
    'fre': 'fra',
    'arm': 'hye',
    'ice': 'isl',
    'geo': 'kat',
    'mac': 'mkd',
    'mao': 'mri',
    'may': 'msa',
    'bur': 'mya',
    'dut': 'nld',
    'rum': 'ron',
    'slo': 'slk',
    'alb': 'sqi',
    'chi': 'zho'
  }
}

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
      // generic properties
      'alpha2': _.get(record, 'properties.wof:country', 'XX').toUpperCase(),
      'alpha3': _.get(record, 'properties.wof:country_alpha3', '').toUpperCase(),
      'name': _.get(record, 'properties.wof:name'),
      'abbr': _.get(record, 'properties.wof:abbreviation'),
      'modified': _.get(record, 'properties.wof:lastmodified'),
      // wof-specific properties
      'wof:shortcode': _.get(record, 'properties.wof:shortcode', '').toUpperCase(),
      'wof:repo': _.get(record, 'properties.wof:repo')
    }
  },
  'name': (record) => {
    let names = []
    const properties = _.get(record, 'properties', {})
    for (let attr in properties) {
      // info about 'abrv': https://github.com/whosonfirst-data/whosonfirst-data/issues/1319
      if (!attr.startsWith('name:') || attr.startsWith('abrv:')) { continue }
      let match = attr.match(/^(name|abrv):([a-z]{3})_x_(preferred|colloquial|variant)$/)
      if (match) {
        // Fix for https://github.com/pelias/placeholder/pull/126
        // Transform iso codes 639-2/B to 639-2/T
        const lang = language.alternatives[match[2]] || match[2]

        // skip if both iso codes 639-2/B and 639-2/T are present and the current iso is 639-2/B
        if (lang !== match[2] && properties['name:' + lang + '_x_' + match[3]]) { continue }

        // index each alternative name & abbreviation (value is an array)
        for (var n in properties[attr]) {
          names.push({
            lang: lang,
            tag: match[3],
            abbr: (match[1] === 'abrv') ? 1 : 0,
            name: properties[attr][n]
          })
        }
      }
    }
    return names
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
