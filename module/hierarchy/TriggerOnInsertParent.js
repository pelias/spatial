const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

/**
 * This trigger (and the associated view) are a convenience method of
 * generating a full hierarchy by only inserting the *immediate parent*
 * of each record.
 *
 * The trigger will ensure that *as parent records are added* that the full
 * hierarchy is generated automatically.
 *
 * Caveat emptor: In an ideal world this method would suffice, however if
 * the hierarchy can't be represented cleanely as a tree, then inserting
 * every parent manually is the preferred method, as manual insertion will
 * allow for the tree to become a graph, with more flexibility in branching.
 *
 * Also worth noting that the triggers use `INSERT OR IGNORE` so the order
 * of insertion will affect the final graph, in a 'perfect tree' scenario
 * this is not an issue, but becomes one when the graph exhibits branching
 * and grafting behaviour.
 */

class TriggerOnInsertParent extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE TRIGGER IF NOT EXISTS hierarchy_on_insert_trigger
        INSTEAD OF INSERT ON ${dbname}.hierarchy_insert_parent
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

module.exports = TriggerOnInsertParent
