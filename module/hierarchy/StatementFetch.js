const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementFetch extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        SELECT *
        FROM ${dbname}.hierarchy
        WHERE child_source = @source
        AND child_id = @id
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementFetch
