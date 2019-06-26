const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementInsert extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        INSERT OR REPLACE INTO ${dbname}.property (
          source,
          id,
          key,
          value
        ) VALUES (
          @source,
          @id,
          @key,
          @value
        )
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementInsert
