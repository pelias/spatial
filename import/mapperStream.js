const through = require('through2')

function streamFactory (mapper) {
  return through.obj((doc, enc, next) => {
    try {
      const place = mapper(doc)

      // skip invalid docs
      if (place === null) { return next() }
      if (!place._isValid()) { return next() }

      // push record downstream
      next(null, place)
    } catch (e) {
      console.error('mapping error', e)
      next()
    }
  })
}

module.exports = streamFactory
