const _ = require('lodash')
const format = require('../format')
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
  }
}

module.exports = {
  ingress: process.stdin,
  record_separator: /\r?\n/,
  format: 'json',
  mapping: mapping
}
