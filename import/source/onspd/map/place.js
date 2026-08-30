const _ = require('lodash')
const Identity = require('../../../../model/Identity')
const Ontology = require('../../../../model/Ontology')
const Place = require('../../../../model/Place')
const Property = require('../../../../model/Property')
const Name = require('../../../../model/Name')

const map = {
  geometries: require('./geometries')
}

function mapper (doc) {
  // instantiate a new place
  const place = new Place(
    new Identity('onspd', _.get(doc, 'pcd', 'unknown').replace(/\s/g, '')),
    new Ontology('admin', _.get(doc, 'place', 'postalcode'))
  )

  // map all columns to properties
  for (let key in doc) {
    place.addProperty(new Property(`onspd:${key}`, doc[key]))
  }

  // name property
  place.addName(new Name('und', 'default', false, _.get(doc, 'pcd2')))
  place.addName(new Name('und', 'default', true, _.get(doc, 'pcd')))

  // map geometries
  map.geometries(place, doc)

  return place
}

module.exports = mapper
