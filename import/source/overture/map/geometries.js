const _ = require('lodash')

const format = require('../../../format')
const Geometry = require('../../../../model/Geometry')
const radius = require('../config/radius')
const turf = {
  point: require('turf-point'),
  buffer: require('@turf/buffer')
}

// unified geometries mapper for all Overture themes
function mapper (place, doc) {
  const geometry = _.get(doc, 'geometry')
  const geomType = _.get(geometry, 'type', '').trim().toUpperCase()
  const isPolygon = geomType.endsWith('POLYGON')

  if (geometry) {
    // division theme: Point geometries with buffering
    if (geomType === 'POINT') {
      // add explicit centroid geometry
      place.addGeometry(new Geometry(
        format.from('geometry', 'geojson', geometry),
        'centroid'
      ))

      // buffer POINT to create a POLYGON based on prominence
      const properties = _.get(doc, 'properties', {})
      const prominence = _.get(properties, 'cartography.prominence')

      const point = turf.point(geometry.coordinates)
      const buffered = turf.buffer(point, radius(prominence), { units: 'degrees', steps: 8 })

      place.addGeometry(new Geometry(
        format.from('geometry', 'geojson', buffered.geometry),
        'buffer'
      ))
    }

    // division and division_area themes: Polygon geometries
    if (isPolygon) {
      place.addGeometry(new Geometry(
        format.from('geometry', 'geojson', geometry),
        'boundary'
      ))
    }
  }
}

module.exports = mapper
