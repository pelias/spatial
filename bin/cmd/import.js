const fs = require('fs')
const path = require('path')
const ImportService = require('../../service/ImportService')
const importStream = require('../../import/stream')

// generate a list of valid sources by scanning the filesystem
const sources = fs.readdirSync(path.resolve(__dirname, '../../import/source'))
  .filter(file => file.endsWith('.js'))
  .map(file => file.replace('.js', ''))

module.exports = {
  command: 'import <source>',
  describe: 'import data into the spatial database',
  builder: (yargs) => {
    // mandatory params
    yargs.positional('source', {
      type: 'string',
      describe: 'name of data source',
      choices: sources,
      demand: 'source is required'
    })

    // optional params
    yargs.option('file', {
      type: 'string',
      default: '/dev/stdin',
      describe: 'file to import'
    })
    yargs.option('db', {
      type: 'string',
      default: 'geo.db',
      describe: 'location of spatial database file'
    })
    yargs.option('ticker', {
      type: 'number',
      default: 1000,
      describe: 'ticker interval (set 0 to disable)'
    })
    yargs.option('verbose', {
      type: 'boolean',
      default: false,
      describe: 'enable verbose logging'
    })

    // tweaks
    yargs.option('tweak_module_geometry_simplify', {
      type: 'number',
      default: 0.00003,
      coerce: parseFloat,
      describe: 'simplification tolerance for geometry module'
    })
    yargs.option('tweak_module_shard_simplify', {
      type: 'number',
      default: 0.00003,
      coerce: parseFloat,
      describe: 'simplification tolerance for shard module'
    })
    yargs.option('tweak_module_shard_complexity', {
      type: 'number',
      default: 500,
      coerce: parseFloat,
      describe: 'max polygon complexity for shard module'
    })
    yargs.option('tweak_module_shard_depth', {
      type: 'number',
      default: 50,
      coerce: parseFloat,
      describe: 'max recursion depth for shard module'
    })
  },
  handler: (argv) => {
    // configure source
    const source = require(`../../import/source/${argv.source}`)
    const stream = importStream(source, argv.file)

    // configure service
    const service = new ImportService({
      readonly: false,
      filename: argv.db,
      database: 'main',
      verbose: argv.verbose,
      module: {
        geometry: {
          simplify: argv.tweak_module_geometry_simplify
        },
        shard: {
          simplify: argv.tweak_module_shard_simplify,
          complexity: argv.tweak_module_shard_complexity,
          depth: argv.tweak_module_shard_depth
        }
      }
    })

    // start ticker
    const ticker = require('../../import/ticker')
    if (argv.ticker && argv.ticker > 0) {
      ticker.start(argv.ticker)
    }

    // import data
    stream
      .pipe(service.createImportStream())
      .on('finish', ticker.stop.bind(ticker))
      .on('finish', service.close.bind(service))
  }
}
