
const _ = require('lodash')
const util = require('./util')
const format = require('../../import/format')

const meta = {
  keywords: ['Geographic', 'Political', 'Administrative', 'Boundary', 'Polygon'],
  description: `Openly licensed geographic data`
}

module.exports.place = function (req, res) {
  const service = req.app.locals.service

  // document identity
  let identity = {
    source: util.flatten(req.params.source),
    id: util.flatten(req.params.id)
  }

  // load place
  let place = service.module.place.statement.fetch.get(identity)
  if (!place) { return res.status(404).json({ error: 'not found' }) }

  // load properties
  place.property = service.module.property.statement.fetch.all(_.extend({}, identity, { limit: 100 }))

  // load names
  place.name = service.module.name.statement.fetch.all(_.extend({}, identity, { limit: 100 }))

  // load hierarchies
  place.hierarchy = service.module.hierarchy.statement.fetch.all(_.extend({}, identity, { limit: 100 }))

  // load geometries
  place.geometry = service.module.geometry.statement.fetch.all(_.extend({}, identity, { limit: 100 }))

  // shift format
  place.geometry = place.geometry.map(row => {
    if (row && row.geom) {
      row.geom = format.to(format.from('geometry', 'wkb', row.geom), 'geojson')
    }
    return row
  })

  // view params
  let params = {
    identity: identity,
    place: place
  }

  // HTML meta tags
  res.locals.metaTags = {
    title: [
      util.preferredName(place.name),
      'Geographic Data',
      `place/${params.identity.source}/${params.identity.id}`
    ].join(' - '),
    description: `${meta.description} for ${util.preferredName(place.name)}`,
    keywords: meta.keywords.concat([
      _.startCase(place.class),
      _.startCase(place.type)
    ]).concat(
      (place.geometry || []).map(g => _.startCase(g.role))
    ).concat(
      (place.name || []).map(n => n.name)
    ).join(', ')
  }

  res.render('pages/place', {
    layout: 'default',
    params: params,
    json: encodeURIComponent(JSON.stringify(params))
  })
}

module.exports.pip = function (req, res) {
  let params = {}

  // HTML meta tags
  res.locals.metaTags = { noindex: true }

  res.render('pages/pip', {
    layout: 'default',
    params: params,
    json: encodeURIComponent(JSON.stringify(params))
  })
}

module.exports.ontology = {}

module.exports.ontology.enumerate = function (req, res) {
  const service = req.app.locals.service
  let params = { ontology: {} }

  // enumerate all classes
  params.ontology = service.module.place.statement.ontology.all({ limit: 100 })

  // enumerate all types per class
  params.ontology.forEach(_class => {
    _class.type = service.module.place.statement.ontology.all({
      class: _class.class,
      limit: 1000
    })
  })

  // HTML meta tags
  res.locals.metaTags = {
    title: [
      'Geographic Data',
      'Browse Ontology'
    ].join(' - '),
    description: meta.description
  }

  res.render('pages/ontology', {
    layout: 'default',
    params: params,
    json: encodeURIComponent(JSON.stringify(params))
  })
}

module.exports.ontology.search = function (req, res) {
  const service = req.app.locals.service

  let query = {
    class: req.params.class,
    type: req.params.type,
    limit: 100
  }

  let params = { query: query }

  // search by ontology
  params.place = service.module.place.statement.ontology.all(query)

  // HTML meta tags
  res.locals.metaTags = {
    title: [
      'Geographic Data',
      'Browse Ontology',
      _.startCase(req.params.class),
      _.startCase(req.params.type)
    ].join(' - '),
    description: meta.description,
    keywords: meta.keywords.concat([
      _.startCase(req.params.class),
      _.startCase(req.params.type)
    ]).join(', ')
  }

  res.render('pages/ontology_search', {
    layout: 'default',
    params: params,
    json: encodeURIComponent(JSON.stringify(params))
  })
}
