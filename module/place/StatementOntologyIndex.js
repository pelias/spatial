const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

const _memoryCache = {}
const cacheKey = (query, action) => [
  _.get(query, 'class'),
  _.get(query, 'type'),
  _.get(query, 'limit'),
  _.get(query, 'offset'),
  action
].join('|')

const cache = (stmt) => {
  return {
    all: (query) => {
      const key = cacheKey(query, 'all')
      if (!_.has(_memoryCache, key)) {
        _.set(_memoryCache, key, stmt.all(query))
      }
      return _.get(_memoryCache, key)
    }
  }
}

class StatementOntologyIndex extends SqliteStatement {
  _transform (res) {
    if (!_.isArray(res)) { return res }

    // enumerate all classes
    const classes = _.uniq(res.map(o => o.class))

    // map response to nested format
    return classes.map(_class => {
      return {
        class: _class,
        total: _.sum(res.filter(o => o.class === _class).map(o => o.total)),
        type: res.filter(o => o.class === _class).map(o => {
          return { type: o.type, total: o.total }
        })
      }
    })
  }
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = cache(
        db.prepare(`
          SELECT class, type, COUNT(*) AS total
          FROM ${dbname}.place
          GROUP BY class, type
          ORDER BY class ASC, type ASC
        `)
      )
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementOntologyIndex
