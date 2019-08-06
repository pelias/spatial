const _ = require('lodash')
const format = require('../../../format')
const Geometry = require('../../../../model/Geometry')
const turf = {
  point: require('turf-point'),
  buffer: require('@turf/buffer')
}

const buffer = {
  radius: 0.0001,
  units: 'degrees',
  steps: 4
}

function mapper (place, doc) {
  let geometry = _.get(doc, 'geometry')
  let geomType = _.get(geometry, 'type', '').trim().toUpperCase()
  let isPolygon = geomType.endsWith('POLYGON')

  if (geometry) {
    if (geomType === 'POINT') {
      // add a explicit centroid geometry so that one
      // does not need to be calculated.
      place.addGeometry(new Geometry(
        format.from('geometry', 'geojson', geometry),
        'centroid'
      ))

      // buffer POINT to a create a POLYGON
      var point = turf.point(geometry.coordinates)
      var buffered = turf.buffer(point, buffer.radius, { units: buffer.units, steps: buffer.steps })
      geometry = buffered.geometry
      geomType = _.get(geometry, 'type', '').trim().toUpperCase()
      isPolygon = geomType.endsWith('POLYGON')
    }

    if (isPolygon) {
      place.addGeometry(new Geometry(
        format.from('geometry', 'geojson', geometry),
        'boundary'
      ))
    }
  }
}

module.exports = mapper
