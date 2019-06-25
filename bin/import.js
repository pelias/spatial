const ImportService = require('../service/ImportService')
const importStream = require('../import/stream')

const service = new ImportService({
  readonly: false,
  filename: process.argv[2] || 'geo.db',
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

const source = require('../import/source/whosonfirst')
const stream = importStream(source)

const ticker = require('../import/ticker')
ticker.start(1000)

// import docs
stream
  .pipe(service.createImportStream())
  .on('finish', ticker.stop.bind(ticker))
