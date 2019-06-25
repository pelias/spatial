const SqliteIndex = require('../../sqlite/SqliteIndex')

class IndexUnique extends SqliteIndex {
  create (db, config) {
    try {
      db.prepare(`
        CREATE UNIQUE INDEX IF NOT EXISTS ${config.database}.document_idx_unique
        ON document(source, id)
      `).run()
    } catch (e) {
      this.error('CREATE INDEX', e)
    }
  }
  drop (db, config) {
    try {
      db.prepare(`
        DROP INDEX IF EXISTS ${config.database}.document_idx_unique
      `).run()
    } catch (e) {
      this.error('DROP INDEX', e)
    }
  }
}

module.exports = IndexUnique
