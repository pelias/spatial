const SqliteIndex = require('../../sqlite/SqliteIndex')

class IndexCovering extends SqliteIndex {
  create (db, config) {
    try {
      db.prepare(`
        CREATE INDEX IF NOT EXISTS ${config.database}.document_idx_covering 
        ON document(source, id, class, type)
      `).run()
    } catch (e) {
      this.error('CREATE INDEX', e)
    }
  }
  drop (db, config) {
    try {
      db.prepare(`
        DROP INDEX IF EXISTS ${config.database}.document_idx_covering
      `).run()
    } catch (e) {
      this.error('DROP INDEX', e)
    }
  }
}

module.exports = IndexCovering
