const _ = require('lodash')

class Property {
  constructor (key, value) {
    this.setKey(key)
    this.setValue(value)
  }
  setKey (key) {
    if (_.isString(key)) {
      this.key = key
    }
  }
  setValue (value) {
    if (_.isString(value)) {
      this.value = value
    }
  }
  _isValid () {
    if (!_.isString(this.key) || !this.key.length) { return false }
    if (!_.isString(this.value) || !this.value.length) { return false }
    return true
  }
}

module.exports = Property
