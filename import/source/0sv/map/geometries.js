const _ = require('lodash')
const format = require('../../../format')
const Geometry = require('../../../../model/Geometry')

function mapper (place, doc) {
  let geometry = _.get(doc, 'geometry')
  let geomType = _.get(geometry, 'type', '').trim().toUpperCase()
  let isLineString = geomType.endsWith('LINESTRING')

  if (geometry) {
    if (isLineString) {
      place.addGeometry(new Geometry(
        format.from('geometry', 'geojson', geometry),
        'centerline'
      ))
    }
  }
}

module.exports = mapper
