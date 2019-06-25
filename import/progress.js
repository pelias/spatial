const through = require('through2')
const ticker = require('./ticker')

// a convenience stream for showing stream progress
// outputs stats to stderr

const streamFactory = function () {
  let seen = 0
  ticker.addIncrementOperation('megabytes', () => seen, true)

  return through.obj(
    (chunk, enc, next) => {
      seen = parseFloat((seen + (chunk.length / 1e+6)).toFixed(8))
      next(null, chunk)
    })
}

module.exports = streamFactory
