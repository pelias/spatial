const _ = require('lodash')
const SqliteTable = require('../../sqlite/SqliteTable')

class TableHierarchy extends SqliteTable {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE TABLE IF NOT EXISTS ${dbname}.hierarchy (
          parent_source TEXT NOT NULL,
          parent_id TEXT NOT NULL,
          child_source TEXT NOT NULL,
          child_id TEXT NOT NULL,
          depth INTEGER NOT NULL,
          branch TEXT NOT NULL
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
        DROP TABLE IF EXISTS ${dbname}.hierarchy
      `).run()
    } catch (e) {
      this.error('DROP TABLE', e)
    }
  }
  merge (db, fromDbName, toDbName) {
    try {
      db.prepare(`
        INSERT INTO ${toDbName}.hierarchy
        SELECT * FROM ${fromDbName}.hierarchy
      `).run()
    } catch (e) {
      this.error('MERGE TABLE', e)
    }
  }
}

module.exports = TableHierarchy
