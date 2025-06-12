const _ = require('lodash')
const SqliteIndex = require('../../sqlite/SqliteIndex')

class ViewInsertParent extends SqliteIndex {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE VIEW IF NOT EXISTS ${dbname}.hierarchy_insert_parent AS
        SELECT * FROM hierarchy
      `).run()
    } catch (e) {
      this.error('CREATE VIEW', e)
    }
  }
  drop (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        DROP VIEW IF EXISTS ${dbname}.hierarchy_insert_parent
      `).run()
    } catch (e) {
      this.error('DROP VIEW', e)
    }
  }
}

module.exports = ViewInsertParent
