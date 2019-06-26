const _ = require('lodash')
const SqliteTable = require('../../sqlite/SqliteTable')

class TableDocument extends SqliteTable {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE TABLE IF NOT EXISTS ${dbname}.document (
          source TEXT NOT NULL,
          id TEXT NOT NULL,
          class TEXT NOT NULL,
          type TEXT NOT NULL
        )
      `).run()
    } catch (e) {
      this.error('CREATE TABLE', e)
    }
  }
  drop (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        DROP TABLE IF EXISTS ${dbname}.document
      `).run()
    } catch (e) {
      this.error('DROP TABLE', e)
    }
  }
}

module.exports = TableDocument
