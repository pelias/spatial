const _ = require('lodash')
const crypto = require('crypto')
const through = require('through2')
const polyline = require('@mapbox/polyline')

function streamFactory (options) {
  const precision = _.get(options, 'precision', 6)
  const generateID = hashID()

  return through.obj((row, enc, next) => {
    // split data in to columns
    let cols = row.toString('utf8') // convert buffer to utf8 string
      .split('\0') // split on delimeter
      .filter(x => x) // remove empty columns

    // must contain a polyline and at least one name
    if (cols.length < 2) {
      console.warn(`[skip] ${row}`)
      return next()
    }

    // generate GeoJSON feature
    let feature = {
      type: 'Feature',
      properties: {
        id: generateID(row),
        names: cols.slice(1)
      },
      geometry: polyline.toGeoJSON(cols[0], precision)
    }

    next(null, feature)
  })
}

// generate a 32 byte content-hash of the row
function hashID () {
  return (row, length = 32) => {
    return crypto.createHash('sha256')
      .update(row)
      .digest('hex')
      .substr(0, length)
  }
}

// generate an auto increment ID
// function autoincrementID() {
//   let autoincrement = 0
//   return () => `${++autoincrement}`
// }

module.exports = streamFactory
