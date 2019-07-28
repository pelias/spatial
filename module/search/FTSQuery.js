const _ = require('lodash')

class FTSQuery {
  constructor (text, settings) {
    this.text = _.isString(text) ? text : ''
    this.settings = _.isPlainObject(settings) ? settings : {}
  }
  toString () {
    // trim text
    this.text = this.text.trim()

    // wrap query text in double-quotes
    let res = `"${this.text}"`

    // add postfix wildcard
    if (this.settings.prefix === true && this.text.length) { res += ' *' }

    return res
  }
}

module.exports = FTSQuery
