const QueryService = require('../../service/QueryService')

module.exports = {
  command: 'pip <lon> <lat>',
  describe: 'point-in-polygon query',
  builder: (yargs) => {
    // mandatory params
    yargs.positional('lon', {
      type: 'number',
      default: 0.0,
      coerce: parseFloat,
      describe: 'longitude'
    })
    yargs.positional('lat', {
      type: 'number',
      default: 0.0,
      coerce: parseFloat,
      describe: 'latitude'
    })

    // optional params
    yargs.option('db', {
      type: 'string',
      default: 'geo.db',
      describe: 'location of spatial database file'
    })
  },
  handler: (argv) => {
    const service = new QueryService({
      readonly: true,
      filename: argv.db
    })

    let query = {
      lon: argv.lon || 0.0,
      lat: argv.lat || 0.0,
      limit: 1000
    }

    let start = new Date().getTime()
    let res = service.module.pip.statement.pip.all(query)
    console.error('took', new Date().getTime() - start, 'ms')

    console.error(query)
    console.error(res)
  }
}
