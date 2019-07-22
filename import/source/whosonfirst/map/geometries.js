const _ = require('lodash')
const wkx = require('wkx')
const format = require('../../../format')
const Geometry = require('../../../../model/Geometry')

function mapper (place, doc, properties) {
  // main geometry
  const geometry = _.get(doc, 'geometry')
  if (geometry) {
    place.addGeometry(new Geometry(
      format.from('geometry', 'geojson', geometry),
      'boundary'
    ))
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
}

module.exports = mapper
