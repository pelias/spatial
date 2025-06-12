const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementInsertParent extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        INSERT OR IGNORE INTO ${dbname}.hierarchy_insert_parent (
          parent_source,
          parent_id,
          child_source,
          child_id,
          branch
        ) VALUES (
          @parent_source,
          @parent_id,
          @child_source,
          @child_id,
          @branch
        )
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementInsertParent
