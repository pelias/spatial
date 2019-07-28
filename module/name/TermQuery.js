const _ = require('lodash')

class TermQuery {
  constructor (text, settings) {
    this.text = _.isString(text) ? text : ''
    this.settings = _.isPlainObject(settings) ? settings : {}
  }
  toString () {
    let res = ''
    this.text = this.text.trim() // trim text

    if (this.text.length) {
      res = this.text
      if (_.get(this.settings, 'wildcard.start') === true) { res = `%${res}` }
      if (_.get(this.settings, 'wildcard.end') === true) { res = `${res}%` }
    }

    return res
  }
}

module.exports = TermQuery
