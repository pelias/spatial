const _ = require('lodash')
const ImportService = require('../../service/ImportService')
const importStream = require('../../import/stream')
const file = require('../../import/file')

module.exports = {
  command: 'import <source>',
  describe: 'import data into the spatial database',
  builder: (yargs) => {
    // mandatory params
    yargs.positional('source', {
      type: 'string',
      describe: 'name of data source',
      choices: ['whosonfirst', 'osmium'],
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
      default: 0.0,
      coerce: parseFloat,
      describe: 'simplification tolerance for geometry module'
    })
    yargs.option('tweak_module_shard_simplify', {
      type: 'number',
      default: 0.0001,
      coerce: parseFloat,
      describe: 'simplification tolerance for shard module'
    })
    yargs.option('tweak_module_shard_complexity', {
      type: 'number',
      default: 200,
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
    const stream = importStream(_.extend(source, { ingress: file(argv.file) }))

    // configure service
    const service = new ImportService({
      readonly: false,
      filename: argv.db,
      database: 'main',
      verbose: argv.verbose,
      module: {
        geometry: {
          simplify: argv.tweak_module_geometry_simplify || undefined
        },
        shard: {
          simplify: argv.tweak_module_shard_simplify || undefined,
          complexity: argv.tweak_module_shard_complexity || undefined,
          depth: argv.tweak_module_shard_depth || undefined
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
  }
}
