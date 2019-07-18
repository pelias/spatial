const split = require('split2')
const parser = require('./parser/parser')
const mapperStream = require('./mapperStream')
const progress = require('./progress')

// create importer stream
function streamFactory (source) {
  let stream = source.ingress
    .pipe(progress())
    .pipe(split(source.record_separator))
    .pipe(parser(source.format))
    .pipe(mapperStream(source.mapper))

  // pause stream until a sink is attached
  stream.pause()

  return stream
}

module.exports = streamFactory
