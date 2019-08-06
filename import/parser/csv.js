const csv = require('csv-parse')

function streamFactory () {
  return csv({
    trim: true,
    cast: false,
    skip_empty_lines: true,
    relax_column_count: false,
    relax: true,
    columns: true,
    highWaterMark: 512
  })
}

module.exports = streamFactory
