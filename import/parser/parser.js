function parser (format, options) {
  switch (format) {
    case 'json':
    case 'jsonl':
    case 'geojson':
      return require('./json')()
    case 'csv':
      return require('./csv')()
    case '0sv':
      return require('./0sv')(options)
    default:
      console.error(`unknown format: ${format}`)
      process.exit(1)
  }
}

module.exports = parser
