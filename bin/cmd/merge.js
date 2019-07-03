const fs = require('fs')
const ImportService = require('../../service/ImportService')

module.exports = {
  command: 'merge <external>',
  describe: 'merge data into the spatial database',
  builder: (yargs) => {
    // mandatory params
    yargs.positional('external', {
      type: 'string',
      describe: 'location of external spatial database file',
      demand: 'external database path is required'
    })

    // optional params
    yargs.option('db', {
      type: 'string',
      default: 'geo.db',
      describe: 'location of spatial database file'
    })
    yargs.option('verbose', {
      type: 'boolean',
      default: false,
      describe: 'enable verbose logging'
    })
  },
  handler: (argv) => {
    // configure service
    const service = new ImportService({
      readonly: false,
      filename: argv.db,
      database: 'main',
      verbose: argv.verbose
    })

    if (!fs.existsSync(argv.external)) {
      console.error(`could not read external database: ${argv.external}`)
      process.exit(1)
    }

    // attach external database
    service.db.prepare(`ATTACH DATABASE '${argv.external}' as 'external'`).run()

    // merge all modules
    for (let modname in service.module) {
      let mod = service.module[modname]
      mod.merge('external')
    }
  }
}
