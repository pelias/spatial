const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementFetch extends SqliteStatement {
  _selectStatement (query) {
    let hasSimplify = _.get(query, 'simplify', 0.0) > 0.0
    let hasRole = _.get(query, 'role', '').length > 1

    if (hasSimplify && hasRole) { return this.statements.fetchWithRoleSimplify }
    if (hasRole) { return this.statements.fetchWithRole }
    if (hasSimplify) { return this.statements.fetchSimplify }
    return this.statements.fetch
  }
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statements = {}

      // fetch
      this.statements.fetch = db.prepare(`
        SELECT *, AsBinary(geom) AS geom
        FROM ${dbname}.geometry
        WHERE source = @source
        AND id = @id
        LIMIT @limit
      `)

      // fetch filter by role
      this.statements.fetchWithRole = db.prepare(`
        SELECT *, AsBinary(geom) AS geom
        FROM ${dbname}.geometry
        WHERE source = @source
        AND id = @id
        AND role = @role
        LIMIT @limit
      `)

      // fetch w/ simplified geometry
      this.statements.fetchSimplify = db.prepare(`
        SELECT *, AsBinary( SimplifyPreserveTopology( geom, @simplify ) ) AS geom
        FROM ${dbname}.geometry
        WHERE source = @source
        AND id = @id
        LIMIT @limit
      `)

      // fetch filter by role w/ simplified geometry
      this.statements.fetchWithRoleSimplify = db.prepare(`
        SELECT *, AsBinary( SimplifyPreserveTopology( geom, @simplify ) ) AS geom
        FROM ${dbname}.geometry
        WHERE source = @source
        AND id = @id
        AND role = @role
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementFetch
