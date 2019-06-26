const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementFetch extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        SELECT *, AsBinary(geom) AS geom
        FROM ${dbname}.geometry
        WHERE source = @source
        AND id = @id
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementFetch
