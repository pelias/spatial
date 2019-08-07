const _ = require('lodash')
const wkx = require('wkx')
const format = require('../../../format')
const Geometry = require('../../../../model/Geometry')
const radius = require('../config/radius')

const turf = {
  point: require('turf-point'),
  buffer: require('@turf/buffer')
}

function mapper (place, doc) {
  // main geometry
  const properties = _.get(doc, 'properties', {})
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

      // select a buffer radius based on placetype
      const rad = radius(_.get(place, 'ontology.type', ''))

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

  // label position
  let lon = _.get(properties, 'lbl:longitude')
  let lat = _.get(properties, 'lbl:latitude')
  if (_.isNumber(lat) && _.isNumber(lon)) {
    place.addGeometry(new Geometry(
      wkx.Geometry.parse(`POINT(${lon} ${lat})`),
      'label_position'
    ))
  }

  // reverse geo position
  lon = _.get(properties, 'reversegeo:longitude')
  lat = _.get(properties, 'reversegeo:latitude')
  if (_.isNumber(lat) && _.isNumber(lon)) {
    place.addGeometry(new Geometry(
      wkx.Geometry.parse(`POINT(${lon} ${lat})`),
      'reversegeo_position'
    ))
  }

  // mapshaper position
  lon = _.get(properties, 'mps:longitude')
  lat = _.get(properties, 'mps:latitude')
  if (_.isNumber(lat) && _.isNumber(lon)) {
    place.addGeometry(new Geometry(
      wkx.Geometry.parse(`POINT(${lon} ${lat})`),
      'mapshaper_position'
    ))
  }
}

module.exports = mapper
