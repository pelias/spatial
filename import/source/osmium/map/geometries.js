const _ = require('lodash')
const format = require('../../../format')
const Geometry = require('../../../../model/Geometry')

function mapper (place, doc) {
  const geometry = _.get(doc, 'geometry')
  if (geometry) {
    place.addGeometry(new Geometry(
      format.from('geometry', 'geojson', geometry),
      'boundary'
    ))
  }
}

module.exports = mapper
