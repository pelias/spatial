const _ = require('lodash')
const Identity = require('./Identity')

class Hierarchy {
  constructor (child, parent, branch, depth = Hierarchy.UNKNOWN_DEPTH) {
    this.setChild(child)
    this.setParent(parent)
    this.setBranch(branch)
    this.setDepth(depth)
  }
  setChild (child) {
    if (child instanceof Identity && child._isValid()) {
      this.child = child
    }
  }
  setParent (parent) {
    if (parent instanceof Identity && parent._isValid()) {
      this.parent = parent
    }
  }
  setBranch (branch) {
    if (_.isString(branch)) {
      this.branch = branch
    }
  }
  setDepth (depth) {
    if (_.isNumber(depth)) {
      this.depth = depth
    }
  }
  _isValid () {
    if (!(this.child instanceof Identity)) { return false }
    if (!(this.parent instanceof Identity)) { return false }
    if (!_.isString(this.branch) || !this.branch.length) { return false }
    if (!_.isNumber(this.depth)) { return false }
    return true
  }
}

Hierarchy.UNKNOWN_DEPTH = -1

module.exports = Hierarchy
