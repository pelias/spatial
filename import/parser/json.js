const through = require('through2')

function streamFactory () {
  return through.obj(
    (row, _, next) => {
      try {
        next(null, JSON.parse(row))
      } catch (e) {
        console.error('invalid json', e)
        next()
      }
    })
}

module.exports = streamFactory
