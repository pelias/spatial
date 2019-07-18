const _ = require('lodash')
const Identity = require('./Identity')

class Hierarchy {
  constructor (child, parent, branch) {
    this.setChild(child)
    this.setParent(parent)
    this.setBranch(branch)
  }
  setChild (child) {
    if (child instanceof Identity) {
      this.child = child
    }
  }
  setParent (parent) {
    if (parent instanceof Identity) {
      this.parent = parent
    }
  }
  setBranch (branch) {
    if (_.isString(branch)) {
      this.branch = branch
    }
  }
  _isValid () {
    if (!(this.child instanceof Identity)) { return false }
    if (!(this.parent instanceof Identity)) { return false }
    if (!_.isString(this.branch) || !this.branch.length) { return false }
    return true
  }
}

module.exports = Hierarchy
