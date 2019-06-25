function parser (format) {
  switch (format) {
    case 'json':
    case 'jsonl':
    case 'geojson':
      return require('./json')()
    default:
      console.error(`unknown format: ${format}`)
      process.exit(1)
  }
}

module.exports = parser
