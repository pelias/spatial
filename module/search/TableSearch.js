const _ = require('lodash')
const SqliteTable = require('../../sqlite/SqliteTable')

class TableSearch extends SqliteTable {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE VIRTUAL TABLE IF NOT EXISTS ${dbname}.search
        USING fts5(
          source UNINDEXED,
          id UNINDEXED,
          lang UNINDEXED,
          tag UNINDEXED,
          name,
          content=name,
          detail='full',
          prefix='1 2 3 4 5 6 7 8'
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
        DROP TABLE IF EXISTS ${dbname}.search
      `).run()
    } catch (e) {
      this.error('DROP TABLE', e)
    }
  }
  merge () { /* not applicable (handled by triggers) */ }
}

module.exports = TableSearch
