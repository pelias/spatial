const _ = require('lodash')
const format = require('../../../format')
const Geometry = require('../../../../model/Geometry')

function mapper (place, doc) {
  const geometry = _.get(doc, 'geometry')
  const isPolygon = _.get(geometry, 'type', '').trim().toUpperCase().endsWith('POLYGON')

  if (geometry) {
    place.addGeometry(new Geometry(
      format.from('geometry', 'geojson', geometry),
      isPolygon ? 'boundary' : 'centroid'
    ))
  }
}

module.exports = mapper
