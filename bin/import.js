const ImportService = require('../service/ImportService')
const importStream = require('../import/stream')
const SOURCES = ['whosonfirst', 'osmium']

// configure source
const _source = process.argv[2]
if (!SOURCES.includes(_source)) { throw new Error(`invalid source: ${_source}`) }
const source = require(`../import/source/${_source}`)
const stream = importStream(source)

// configure service
const service = new ImportService({
  readonly: false,
  filename: process.argv[3] || 'geo.db',
  database: 'main',
  module: {
    geometry: {
      // simplify: 0.00005
    },
    shard: {
      simplify: 0.0001,
      complexity: 200,
      depth: 50
    }
  }
})

// start ticker
const ticker = require('../import/ticker')
ticker.start(1000)

// import docs
stream
  .pipe(service.createImportStream())
  .on('finish', ticker.stop.bind(ticker))
