const _ = require('lodash')
const util = require('./util')
const identity = (place) => `${place.source}|${place.id}`
const childIdentity = (h) => identity({ source: h.child_source, id: h.child_id })
const parentIdentity = (h) => identity({ source: h.parent_source, id: h.parent_id })
const parentToPlace = (row) => {
  return {
    source: row.parent_source,
    id: parseInt(row.parent_id, 10)
  }
}

const findImmediateParentsStmt = (service, children) => {
  let dbname = _.get(service.config, 'database', 'main')

  const conditions = children.map(child => `(
    child_source = '${child.source}' AND
    child_id = '${child.id}'
  )`).join(' OR ')

  return service.db.prepare(`
    SELECT *
    FROM ${dbname}.hierarchy
    WHERE depth = 1
    AND (${conditions})
    ORDER BY branch ASC, depth ASC`
  )
}

const findDefaultPlaceNames = (service, places, langs, tags) => {
  let dbname = _.get(service.config, 'database', 'main')

  const conditions = places.map(place => {
    const fields = [
      `source = '${place.source}'`,
      `id = '${place.id}'`
    ]
    if (_.isArray(langs) && !_.isEmpty(langs)) {
      const values = langs.map(lang => `'${lang}'`)
      fields.push(`lang IN (${values.join(',')})`)
    }
    if (_.isArray(tags) && !_.isEmpty(tags)) {
      const values = tags.map(tag => `'${tag}'`)
      fields.push(`tag IN (${values.join(',')})`)
    }

    return fields.join(' AND ')
  })

  return service.db.prepare(`
    SELECT *
    FROM ${dbname}.name
    WHERE (${conditions.join(' OR ')})`)
}

const findPlaceInfoStmt = (service, places) => {
  let dbname = _.get(service.config, 'database', 'main')

  const conditions = places.map(place => `(
    place.source = '${place.source}' AND
    place.id = '${place.id}'
  )`).join(' OR ')

  return service.db.prepare(`
    SELECT
    place.*
    FROM ${dbname}.place
    WHERE (${conditions})`
  )

  // return service.db.prepare(`
  //   SELECT
  //   place.*,
  //   json_extract( AsGeoJSON(envelope.geom, 7, 1), '$.bbox') AS envelope,
  //   json_extract( AsGeoJSON(centroid.geom, 7), '$.coordinates') AS centroid
  //   FROM ${dbname}.place
  //   LEFT JOIN ${dbname}.geometry AS centroid ON (
  //     centroid.source = place.source AND
  //     centroid.id = place.id AND
  //     centroid.role = 'centroid'
  //   )
  //   LEFT JOIN ${dbname}.geometry AS envelope ON (
  //     envelope.source = place.source AND
  //     envelope.id = place.id AND
  //     envelope.role = 'envelope'
  //   )
  //   WHERE (${conditions})`
  // )
}

module.exports = function (req, res) {
  // inputs
  const query = {
    lon: parseFloat(util.flatten(req.query.lon)),
    lat: parseFloat(util.flatten(req.query.lat)),
    role: 'boundary',
    limit: 1000
  }

  const langs = (util.flatten(req.query.lang) || '').split(',').map(_.trim).filter(n => n.length)
  const tags = (util.flatten(req.query.tag) || '').split(',').map(_.trim).filter(n => n.length)

  const service = req.app.locals.service

  // perform PIPs
  console.time('hits took')
  let hits = service.module.pip.statement.pip.all(query)
  console.timeEnd('hits took')

  if (_.isEmpty(hits)) {
    // send json
    res.status(404).json({
      hits: []
    })
    return
  }

  // get hierarchies
  console.time('hierarchy took')
  const hierarchyRows = findImmediateParentsStmt(service, hits).all()
  const hierarchy = mapHierarchies(hierarchyRows)
  console.timeEnd('hierarchy took')

  // find all references IDs
  let references = _.uniqWith(
    _.union(
      hits,
      hierarchyRows.map(parentToPlace).filter(p => p.id > 0)
    ),
    _.isEqual
  )

  let places = {}
  let names = {}

  // find place + geom info
  console.time('info took')
  // console.error(references)
  findPlaceInfoStmt(service, references).all(query)
    .forEach(row => {
      const iden = identity(row)
      _.set(places, iden, _.pick(row, ['source', 'id', 'class', 'type']))
      // _.set(places, `${iden}.geometry.centroid`, JSON.parse(row.centroid) || undefined)
      // _.set(places, `${iden}.geometry.envelope`, JSON.parse(row.envelope) || undefined)
      // _.set(places, `${iden}.geometry.centroid`, row.centroid || undefined)
      // _.set(places, `${iden}.geometry.envelope`, row.envelope || undefined)
    })
  console.timeEnd('info took')

  // add default names
  // console.time('names took')
  // findDefaultPlaceNames(service, references).all()
  //   .forEach(row => {
  //     const iden = identity(row)
  //     let namesById = _.get(names, `${iden}['${row.lang}|${row.tag}']`)
  //     if (!_.isArray(namesById)) {
  //       namesById = []
  //       _.set(names, `${iden}['${row.lang}|${row.tag}']`, namesById)
  //     }
  //     const name = _.pick(row, ['name', 'abbr'])
  //     name.abbr = !!name.abbr
  //     namesById.push(name)
  //   })
  // console.timeEnd('names took')

  console.time('names took')
  const rows = findDefaultPlaceNames(service, references, langs, tags).all()
  names = _.mapValues(
    _.groupBy(rows, identity),
    (namesGroupedByID) => _.mapValues(
      _.groupBy(namesGroupedByID, (row) => `${row.lang}|${row.tag}`),
      (namesGroupedByLangAndTag) => {
        const memo = {}
        namesGroupedByLangAndTag.forEach(n => {
          const field = (n.abbr === 1) ? 'abbr' : 'name'
          if (!_.isArray(memo[field])) { memo[field] = [] }
          memo[field].push(n.name)
        })
        return memo
      }
    )
  )
  console.timeEnd('names took')

  // send json
  res.status(200).json({
    hits: hits.map(identity),
    hierarchy: hierarchy,
    place: places,
    name: names
  })
}

function mapHierarchies (rows) {
  let branch = {}

  rows.forEach(row => {
    _.set(branch, `${row.branch}.${childIdentity(row)}`, parentIdentity(row))
  })

  return branch
}

// function mapHierarchies(service, hits) {
//   let branch = {}

//   hits.forEach(hit => {
//     const rows = service.module.hierarchy.statement.fetch.all({
//       source: hit.source,
//       id: hit.id,
//       limit: 1000
//     })

//     rows.forEach(r => {
//       if (r.depth != 1) { return } // @todo: do this in SQL
//       _.set(branch, `${r.branch}.${childIdentity(r)}`, parentIdentity(r))
//     })
//   })

//   return branch
// }

// function mapHierarchies(service, hits) {
//   let foo = []

//   hits.forEach(hit => {
//     foo = foo.concat( service.module.hierarchy.statement.fetch.all({
//       source: hit.source,
//       id: hit.id,
//       limit: 1000
//     }))
//   })

//   foo = foo.filter(h => h.depth === 1 )

//   let childIdentity = (h) => identity({ source: h.child_source, id: h.child_id })
//   let parentIdentity = (h) => identity({ source: h.parent_source, id: h.parent_id })

//   return _.mapValues(
//     _.groupBy(foo, 'branch'),
//     v => _.mapValues(
//         _.mapValues(
//           _.groupBy(v, childIdentity),
//           _.first
//         ),
//       parentIdentity
//     )
//   )
// }

// function mapHierarchies(service, hits){
//   return _.reduce(hits, (memo, place) => {
//     const parents = service.module.hierarchy.statement.fetch.all({
//       source: place.source,
//       id: place.id,
//       limit: 1000
//     })
//     memo[identity(place)] = _.mapValues(_.groupBy(parents, 'branch'), v => v.map(parentIdentity))
//     return memo
//   }, {})
// }
