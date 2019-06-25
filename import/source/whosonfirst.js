const _ = require('lodash')
const format = require('../format')
const mapping = {
  'source': () => 'wof',
  'source_id': 'id',
  'class': () => 'admin',
  'type': (record) => _.get(record, 'properties.wof:placetype'),
  // 'bbox': 'bbox',
  // 'bbox_format': () => 'WSEN',
  'geometry': (record) => format.from('geometry', 'geojson', record.geometry)
}

module.exports = {
  ingress: process.stdin,
  record_separator: /\r?\n/,
  format: 'json',
  mapping: mapping
}
