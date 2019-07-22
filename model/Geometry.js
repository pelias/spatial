const _ = require('lodash')
const WKXBaseClass = require('wkx/lib/geometry')

class Geometry {
  constructor (geometry, role) {
    this.setGeometry(geometry)
    this.setRole(role)
  }
  setGeometry (geometry) {
    if (geometry instanceof WKXBaseClass) {
      this.geometry = geometry
    }
  }
  setRole (role) {
    if (_.isString(role)) {
      this.role = role
    }
  }
  _isValid () {
    if (!(this.geometry instanceof WKXBaseClass)) { return false }
    if (!_.isString(this.role) || !this.role.length) { return false }
    return true
  }
}

module.exports = Geometry
