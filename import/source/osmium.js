const _ = require('lodash')
const format = require('../format')
const DELIM = ':'

const mapping = {
  'source': () => 'osm',
  'source_id': (record) => _.get(record, 'properties.@type') + DELIM + _.get(record, 'properties.@id'),
  'class': () => 'admin',
  'type': (record) => _.get(record, 'properties.place', 'unknown'),
  'geometry': (record) => format.from('geometry', 'geojson', record.geometry),
  'valid': () => true,
  'property': (record) => _.pickBy(record.properties, (val, key) => !key.startsWith('@'))
}

module.exports = {
  ingress: process.stdin,
  record_separator: /\r?\n/,
  format: 'json',
  mapping: mapping
}
