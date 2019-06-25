const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementInsert extends SqliteStatement {
  create (db, config) {
    try {
      this.statement = db.prepare(`
        INSERT OR REPLACE INTO ${config.database}.document (
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
