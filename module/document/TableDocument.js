const SqliteTable = require('../../sqlite/SqliteTable')

class TableDocument extends SqliteTable {
  create (db, config) {
    try {
      db.prepare(`
        CREATE TABLE IF NOT EXISTS ${config.database}.document (
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
      db.prepare(`
        DROP TABLE IF EXISTS ${config.database}.document
      `).run()
    } catch (e) {
      this.error('DROP TABLE', e)
    }
  }
}

module.exports = TableDocument
