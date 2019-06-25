const _ = require('lodash')
const Sqlite = require('../sqlite/Sqlite')

class PragmaStatement extends Sqlite {
  constructor (key, values, fetch) {
    super()
    this.key = key
    this.value = values[0]
    this.value_readonly = values[1]
    this.fetch = fetch === true
  }
  run (db, config) {
    let readonly = (_.get(config, 'readonly', false) === true)
    let dbname = _.get(config, 'database', 'main')
    let value = readonly ? this.value_readonly : this.value
    if (typeof value !== 'string' || !value.length) { return }
    try {
      if (this.fetch) {
        db.prepare(`PRAGMA ${dbname}.${this.key.trim()}=${value.trim()}`).get()
      } else {
        db.prepare(`PRAGMA ${dbname}.${this.key.trim()}=${value.trim()}`).run()
      }
    } catch (e) {
      this.error('PRAGMA', e)
    }
  }
}

module.exports = PragmaStatement
