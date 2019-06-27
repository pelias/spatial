const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class TriggerOnInsert extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE TRIGGER IF NOT EXISTS hierarchy_on_insert_trigger
        INSTEAD OF INSERT ON ${dbname}.hierarchy_insert_proxy
        BEGIN

          /* insert self-reference for parent at depth 0 */
          INSERT OR IGNORE INTO hierarchy (
            parent_source,
            parent_id,
            child_source,
            child_id,
            depth,
            branch
          ) VALUES (
            NEW.parent_source,
            NEW.parent_id,
            NEW.parent_source,
            NEW.parent_id,
            0,
            NEW.branch
          );

          /* insert self-reference for child at depth 0 */
          INSERT OR IGNORE INTO hierarchy (
            parent_source,
            parent_id,
            child_source,
            child_id,
            depth,
            branch
          ) VALUES (
            NEW.child_source,
            NEW.child_id,
            NEW.child_source,
            NEW.child_id,
            0,
            NEW.branch
          );

          /* update graph references */
          INSERT OR IGNORE INTO hierarchy (
            parent_source,
            parent_id,
            child_source,
            child_id,
            depth,
            branch
          )
          SELECT
            p.parent_source,
            p.parent_id,
            c.child_source,
            c.child_id,
            p.depth + c.depth + 1 AS depth,
            NEW.branch
          FROM
            hierarchy p,
            hierarchy c
          WHERE (
            p.child_source = NEW.parent_source AND
            p.child_id = NEW.parent_id AND
            p.branch = NEW.branch
          ) AND (
            c.parent_source = NEW.child_source AND
            c.parent_id = NEW.child_id AND
            c.branch = NEW.branch
          );

        END
      `).run()
    } catch (e) {
      this.error('CREATE TRIGGER', e)
    }
  }
  drop (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        DROP TRIGGER IF EXISTS ${dbname}.hierarchy_on_insert_trigger
      `).run()
    } catch (e) {
      this.error('DROP TRIGGER', e)
    }
  }
}

module.exports = TriggerOnInsert
