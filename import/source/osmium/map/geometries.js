const _ = require('lodash')
const format = require('../../../format')
const Geometry = require('../../../../model/Geometry')
const Rank = require('../config/Rank')
const radius = require('../config/radius')

const turf = {
  point: require('turf-point'),
  buffer: require('@turf/buffer')
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

      // compute the nominatum rank
      const rank = new Rank()
      rank.infer(place, doc)

      // select a buffer radius based on place rank
      const rad = radius(rank)

      // buffer POINT to a create a POLYGON
      var point = turf.point(geometry.coordinates)
      var buffered = turf.buffer(point, rad, { units: 'degrees', steps: 8 })

      place.addGeometry(new Geometry(
        format.from('geometry', 'geojson', buffered.geometry),
        'buffer'
      ))
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
