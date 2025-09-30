const path = require('path')
const spawn = require('child_process').spawn

module.exports = {
  command: 'server',
  describe: 'launch the HTTP server',
  builder: (yargs) => {
    // optional params
    yargs.option('db', {
      type: 'string',
      describe: 'location of spatial database file'
    })
  },
  handler: (argv) => {
    const script = path.resolve(__dirname, '../../server/http.js')
    spawn('node', [script, ...argv.db ? [argv.db] : []], { stdio: 'inherit' })
  }
}
