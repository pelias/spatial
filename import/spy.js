const through = require('through2')

// a convenience stream for debugging
// the stream will print all data to stderr

const streamFactory = function () {
  return through.obj(
    (chunk, enc, next) => {
      console.error(chunk)
      next(null, chunk)
    },
    (done) => {
      console.error('spy: done')
      done()
    })
}

module.exports = streamFactory
