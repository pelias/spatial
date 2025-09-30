const _ = require('lodash')
const path = require('path')
const peliasConfig = require('pelias-config')
const PragmaStatement = require('./PragmaStatement')

class ServiceConfiguration {
  constructor (config) {
    this.filename = _.get(config, 'filename', 'geo.db')
    this.database = _.get(config, 'database', 'main')
    this.verbose = (_.get(config, 'verbose', false) === true)
    this.readonly = (_.get(config, 'readonly', false) === true)
    this.module = _.get(config, 'module', {}) // module config

    this.pragma = _.get(config, 'pragma', [
      new PragmaStatement('journal_mode', ['MEMORY', 'OFF']),
      new PragmaStatement('locking_mode', ['EXCLUSIVE', 'NORMAL'], true),
      new PragmaStatement('default_cache_size', ['2000']),
      new PragmaStatement('mmap_size', ['0', '268435456'], true), // @todo is this optimal?
      new PragmaStatement('synchronous', ['OFF']),
      new PragmaStatement('foreign_keys', ['OFF']),
      new PragmaStatement('temp_store', ['MEMORY']),
      new PragmaStatement('locking_mode', ['NORMAL'], true),
      new PragmaStatement('page_size', ['4096']),
      new PragmaStatement('cache_size', ['2000']),
      new PragmaStatement('recursive_triggers', ['ON', 'OFF'])
    ])

    // optionally read database filename from pelias/config (when available)
    // note: you must set `config.pelias=true` to enable this functionality as
    // it is undesirable at index generation time (for instance).
    // note: existing `config.filename` value takes precedence over pelias config
    if (!_.has(config, 'filename') && _.get(config, 'pelias') === true) {
      const config = peliasConfig.generate().get('services.spatial')
      if (config && !_.isEmpty(config.datapath) && !_.isEmpty(config.files)) {
        this.filename = path.resolve(config.datapath, _.first(_.castArray(config.files)))
      }
    }
  }
}

module.exports = ServiceConfiguration
