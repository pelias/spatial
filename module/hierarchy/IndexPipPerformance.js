const _ = require('lodash')
const SqliteIndex = require('../../sqlite/SqliteIndex')

/**
 * This index is used to speed up JOIN opperations from PIP queries.
 *
 * FROM hierarchy
 * WHERE child_id = place.id
 * AND parent_id != child_id
 * AND branch = 'wof:0'
 */

class IndexPipPerformance extends SqliteIndex {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE INDEX IF NOT EXISTS ${dbname}.hierarchy_idx_pip_performance 
        ON hierarchy(child_id, branch, parent_id)
      `).run()
    } catch (e) {
      this.error('CREATE INDEX', e)
    }
  }
  drop (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        DROP INDEX IF EXISTS ${dbname}.hierarchy_idx_pip_performance
      `).run()
    } catch (e) {
      this.error('DROP INDEX', e)
    }
  }
}

module.exports = IndexPipPerformance
