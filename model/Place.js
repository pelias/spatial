const Identity = require('./Identity')
const Ontology = require('./Ontology')
const Property = require('./Property')
const Name = require('./Name')
const Hierarchy = require('./Hierarchy')
const WKXBaseClass = require('wkx/lib/geometry')

class Place {
  constructor (identity, ontology) {
    this.setIdentity(identity)
    this.setOntology(ontology)
    this.property = []
    this.name = []
    this.hierarchy = []
    this.geometry = []
  }
  setIdentity (identity) {
    if (identity instanceof Identity && identity._isValid()) {
      this.identity = identity
    }
  }
  setOntology (ontology) {
    if (ontology instanceof Ontology && ontology._isValid()) {
      this.ontology = ontology
    }
  }
  addProperty (property) {
    if (property instanceof Property && property._isValid()) {
      this.property.push(property)
    }
  }
  addName (name) {
    if (name instanceof Name && name._isValid()) {
      this.name.push(name)
    }
  }
  addHierarchy (hierarchy) {
    if (hierarchy instanceof Hierarchy && hierarchy._isValid()) {
      this.hierarchy.push(hierarchy)
    }
  }
  addGeometry (geometry) {
    if (geometry instanceof WKXBaseClass) {
      this.geometry.push(geometry)
    }
  }
  _isValid () {
    if (!(this.identity instanceof Identity)) { return false }
    if (!(this.ontology instanceof Ontology)) { return false }
    return true
  }
}

module.exports = Place
