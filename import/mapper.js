const _ = require('lodash')
const through = require('through2')

function streamFactory (mapping) {
  return through.obj(
    (record, enc, next) => {
      try {
        let mapped = {}
        for (let attr in mapping) {
          let val = mapping[attr]
          if (typeof val === 'function') {
            _.set(mapped, attr, val(record, mapped))
          } else if (typeof val === 'string') {
            _.set(mapped, attr, _.get(record, val, undefined))
          }
        }
        next(null, mapped)
      } catch (e) {
        console.error('mapping error', e)
        next()
      }
    })
}

module.exports = streamFactory
