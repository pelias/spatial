const _ = require('lodash')
const SqliteIndex = require('../../sqlite/SqliteIndex')

class IndexUnique extends SqliteIndex {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE UNIQUE INDEX IF NOT EXISTS ${dbname}.hierarchy_idx_unique
        ON hierarchy(parent_source, parent_id, child_source, child_id, depth, branch)
      `).run()
    } catch (e) {
      this.error('CREATE INDEX', e)
    }
  }
  drop (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        DROP INDEX IF EXISTS ${dbname}.hierarchy_idx_unique
      `).run()
    } catch (e) {
      this.error('DROP INDEX', e)
    }
  }
}

module.exports = IndexUnique
