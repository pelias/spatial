const _ = require('lodash')
const format = require('../../../format')
const Geometry = require('../../../../model/Geometry')
const rad = 0.001 // select a buffer radius

const turf = {
  point: require('turf-point'),
  buffer: require('@turf/buffer')
}

function mapper (place, doc) {
  // convert CSV rows to geojson point
  const geometry = {
    type: 'Point',
    coordinates: [
      parseFloat(_.get(doc, 'long')),
      parseFloat(_.get(doc, 'lat'))
    ]
  }

  // there are some errors in the data such as:
  // { pcd: 'AB113AG', lat: '99.999999', long: '0.000000' }
  if (
    (geometry.coordinates[0] === 0 && geometry.coordinates[1] === 0) ||
    !_.inRange(geometry.coordinates[0], -180, 180) ||
    !_.inRange(geometry.coordinates[1], -90, 90)
  ) {
    console.error(`invalid coordinates for ${place.identity.id}`, geometry.coordinates)
    return
  }

  // add a explicit centroid geometry so that one
  // does not need to be calculated.
  place.addGeometry(new Geometry(
    format.from('geometry', 'geojson', geometry),
    'centroid'
  ))

  try {
    // buffer POINT to a create a POLYGON
    var point = turf.point(geometry.coordinates)
    var buffered = turf.buffer(point, rad, { units: 'degrees', steps: 8 })

    place.addGeometry(new Geometry(
      format.from('geometry', 'geojson', buffered.geometry),
      'buffer'
    ))
  } catch (e) {
    // there are some errors in the data such as:
    // { pcd: 'AB113AG', lat: '99.999999', long: '0.000000' }
    console.error(`Geometry buffering failed for ${place.identity.id}`, geometry.coordinates)
    console.error(e.message)
  }
}

module.exports = mapper
