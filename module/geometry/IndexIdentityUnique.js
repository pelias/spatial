const _ = require('lodash')
const SqliteIndex = require('../../sqlite/SqliteIndex')

class IndexIdentityUnique extends SqliteIndex {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE UNIQUE INDEX IF NOT EXISTS ${dbname}.geometry_idx_unique 
        ON geometry(source, id, role)
      `).run()
    } catch (e) {
      this.error('CREATE INDEX', e)
    }
  }
  drop (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        DROP INDEX IF EXISTS ${dbname}.geometry_idx_unique
      `).run()
    } catch (e) {
      this.error('DROP INDEX', e)
    }
  }
}

module.exports = IndexIdentityUnique
