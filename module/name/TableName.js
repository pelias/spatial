const _ = require('lodash')
const SqliteTable = require('../../sqlite/SqliteTable')

class TableName extends SqliteTable {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE TABLE IF NOT EXISTS ${dbname}.name (
          source TEXT NOT NULL,
          id TEXT NOT NULL,
          lang TEXT NOT NULL COLLATE NOCASE,
          tag TEXT NOT NULL COLLATE NOCASE,
          abbr INTEGER NOT NULL,
          name TEXT NOT NULL COLLATE NOCASE
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
        DROP TABLE IF EXISTS ${dbname}.name
      `).run()
    } catch (e) {
      this.error('DROP TABLE', e)
    }
  }
  merge (db, fromDbName, toDbName) {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO ${toDbName}.name
        SELECT * FROM ${fromDbName}.name
      `).run()
    } catch (e) {
      this.error('MERGE TABLE', e)
    }
  }
}

module.exports = TableName
