const _ = require('lodash')

class Ontology {
  constructor (_class, type) {
    this.setClass(_class)
    this.setType(type)
  }
  setClass (_class) {
    if (_.isString(_class)) {
      this.class = _class
    }
  }
  setType (type) {
    if (_.isString(type)) {
      this.type = type
    }
  }
  _isValid () {
    if (!_.isString(this.class) || !this.class.length) { return false }
    if (!_.isString(this.type) || !this.type.length) { return false }
    return true
  }
}

module.exports = Ontology
