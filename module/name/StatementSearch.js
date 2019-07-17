const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementSearch extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        SELECT source, id, name
        FROM ${dbname}.name
        WHERE name LIKE @name || '%'
        GROUP BY source, id
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementSearch
