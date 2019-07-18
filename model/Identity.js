const _ = require('lodash')

class Identity {
  constructor (source, id) {
    this.setSource(source)
    this.setId(id)
  }
  setSource (source) {
    if (_.isString(source)) {
      this.source = source
    }
  }
  setId (id) {
    if (_.isString(id)) {
      this.id = id
    }
  }
  _isValid () {
    if (!_.isString(this.source) || !this.source.length) { return false }
    if (!_.isString(this.id) || !this.id.length) { return false }
    return true
  }
}

module.exports = Identity
