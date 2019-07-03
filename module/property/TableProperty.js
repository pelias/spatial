const _ = require('lodash')
const SqliteTable = require('../../sqlite/SqliteTable')

class TableGeometry extends SqliteTable {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE TABLE IF NOT EXISTS ${dbname}.property (
          source TEXT NOT NULL,
          id TEXT NOT NULL,
          key TEXT NOT NULL,
          value TEXT NOT NULL
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
        DROP TABLE IF EXISTS ${dbname}.property
      `).run()
    } catch (e) {
      this.error('DROP TABLE', e)
    }
  }
  merge (db, fromDbName, toDbName) {
    try {
      db.prepare(`
        INSERT INTO ${toDbName}.property
        SELECT * FROM ${fromDbName}.property
      `).run()
    } catch (e) {
      this.error('MERGE TABLE', e)
    }
  }
}

module.exports = TableGeometry
