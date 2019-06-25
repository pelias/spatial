const _ = require('lodash')
const wkx = require('wkx')
const formats = {
  WKT: 'Wkt',
  WKB: 'Wkb',
  EWKT: 'Ewkt',
  EWKB: 'Ewkb',
  TWKB: 'Twkb',
  GEOJSON: 'GeoJSON'
}
const types = {
  GEOMETRY: 'Geometry',
  POINT: 'Point',
  LINESTRING: 'LineString',
  POLYGON: 'Polygon',
  MULTIPOINT: 'MultiPoint',
  MULTILINESTRING: 'MultiLineString',
  MULTIPOLYGON: 'MultiPolygon',
  GEOMETRYCOLLECTION: 'GeometryCollection'
}

// convert between geometry ss
// see: https://github.com/cschwarz/wkx

function from (type, format, geom) {
  // normalize inputs
  type = types[type.trim().toUpperCase()]
  format = formats[format.trim().toUpperCase()]

  // ensure wkx supports this type
  if (!wkx.hasOwnProperty(type)) {
    throw new Error(`invalid type: ${type}`)
  }

  // wkx function to use
  let func = _.get(wkx, `${type}.parse${format}`)

  // ensure wkx supports this format
  if (!_.isFunction(func)) {
    throw new Error(`invalid format: ${format}`)
  }

  return func(geom)
}

function to (geom, format) {
  // normalize inputs
  format = formats[format.trim().toUpperCase()]

  // wkx function to use
  let func = _.get(geom, `to${format}`)

  // ensure wkx supports this format
  if (!_.isFunction(func)) {
    throw new Error(`invalid format: ${format}`)
  }

  return geom[`to${format}`]()
}

function type (geom) {
  return geom.constructor.name.toUpperCase()
}

module.exports = {
  from: from,
  to: to,
  type: type
}
