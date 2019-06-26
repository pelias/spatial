const _ = require('lodash')
const SqliteTable = require('../../sqlite/SqliteTable')

class TableGeometry extends SqliteTable {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE TABLE IF NOT EXISTS ${dbname}.geometry (
          source TEXT NOT NULL,
          id TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'default'
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
        DROP TABLE IF EXISTS ${dbname}.geometry
      `).run()
    } catch (e) {
      this.error('DROP TABLE', e)
    }
  }
}

module.exports = TableGeometry
