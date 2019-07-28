const _ = require('lodash')
const SqliteTable = require('../../sqlite/SqliteTable')

class TableSearchVocab extends SqliteTable {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE VIRTUAL TABLE IF NOT EXISTS ${dbname}.search_vocab
        USING fts5vocab(search, instance)
      `).run()
    } catch (e) {
      this.error('CREATE TABLE', e)
    }
  }
  drop (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        DROP TABLE IF EXISTS ${dbname}.search_vocab
      `).run()
    } catch (e) {
      this.error('DROP TABLE', e)
    }
  }
  merge () { /* not applicable */ }
}

module.exports = TableSearchVocab
