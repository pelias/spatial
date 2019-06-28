const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementInsert extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        INSERT OR REPLACE INTO ${dbname}.place (
          source,
          id,
          class,
          type
        ) VALUES (
          @source,
          @id,
          @class,
          @type
        )
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementInsert
