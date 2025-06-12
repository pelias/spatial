const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

/**
 * When inserting hierarchy entries manuually (ie. instead of
 * using the InsertParent view.) some care needs to be taken to:
 *
 * - Create a self-referencing entry at depth=0
 * - Manually assign the correct depth values for each entry
 */

class StatementInsert extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        INSERT OR IGNORE INTO ${dbname}.hierarchy (
          parent_source,
          parent_id,
          child_source,
          child_id,
          depth,
          branch
        ) VALUES (
          @parent_source,
          @parent_id,
          @child_source,
          @child_id,
          @depth,
          @branch
        )
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementInsert
