const _ = require('lodash')
const wkx = require('wkx')
const format = require('../../../format')
const Geometry = require('../../../../model/Geometry')

function mapper (place, doc) {
  const geometry = _.get(doc, 'geometry')
  const properties = _.get(doc, 'properties', {})
  const isPolygon = _.get(geometry, 'type', '').trim().toUpperCase().endsWith('POLYGON')

  if (geometry) {
    place.addGeometry(new Geometry(
      format.from('geometry', 'geojson', geometry),
      isPolygon ? 'boundary' : 'centroid'
    ))
  }

  // skip additional geometries if main geometry is not a polygon
  if (!isPolygon) { return }

  // 'internal point'
  let lon = parseFloat(_.get(properties, 'INTPTLON20'))
  let lat = parseFloat(_.get(properties, 'INTPTLAT20'))
  if (!isNaN(lat) && !isNaN(lon)) {
    place.addGeometry(new Geometry(
      wkx.Geometry.parse(`POINT(${lon} ${lat})`),
      'centroid'
    ))
  }
}

module.exports = mapper
