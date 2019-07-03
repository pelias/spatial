const _ = require('lodash')
const SqliteTable = require('../../sqlite/SqliteTable')

class TableShard extends SqliteTable {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE TABLE IF NOT EXISTS ${dbname}.shard (
          source TEXT NOT NULL,
          id TEXT NOT NULL,
          path TEXT NOT NULL DEFAULT '0',
          complexity INTEGER DEFAULT NULL
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
        DROP TABLE IF EXISTS ${dbname}.shard
      `).run()
    } catch (e) {
      this.error('DROP TABLE', e)
    }
  }
  merge (db, fromDbName, toDbName) {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO ${toDbName}.shard
        SELECT * FROM ${fromDbName}.shard
      `).run()
    } catch (e) {
      this.error('MERGE TABLE', e)
    }
  }
}

module.exports = TableShard
