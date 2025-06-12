const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const TableHierarchy = require('./TableHierarchy')
const ViewInsertParent = require('./ViewInsertParent')
const TriggerOnInsertParent = require('./TriggerOnInsertParent')
const IndexUnique = require('./IndexUnique')

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableHierarchy()
  table.create(db)

  // create index
  let idx = new IndexUnique()
  idx.create(db)

  // create view
  let view = new ViewInsertParent()
  view.create(db)

  // trigger does not exist
  t.notOk(introspect.triggers('hierarchy_insert_parent').length, 'prior state')

  // create trigger
  let trigger = new TriggerOnInsertParent()
  trigger.create(db)

  // trigger exists
  t.ok(introspect.triggers('hierarchy_insert_parent').length, 'create')

  // drop trigger
  trigger.drop(db)

  // trigger does not exist
  t.notOk(introspect.triggers('hierarchy_insert_parent').length, 'drop')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // create table
  let table = new TableHierarchy()
  table.create(db)

  // create index
  let idx = new IndexUnique()
  idx.create(db)

  // create view
  let view = new ViewInsertParent()
  view.create(db)

  // create trigger
  let trigger = new TriggerOnInsertParent()
  trigger.create(db)

  // test triggers
  let triggers = introspect.triggers('hierarchy_insert_parent')

  // hierarchy_idx_covering
  t.same(triggers[0], {
    type: 'trigger',
    name: 'hierarchy_on_insert_trigger',
    tbl_name: 'hierarchy_insert_parent',
    rootpage: 0,
    sql: `
        CREATE TRIGGER IF NOT EXISTS hierarchy_on_insert_trigger
        INSTEAD OF INSERT ON main.hierarchy_insert_parent
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
      `.trim().replace(' IF NOT EXISTS', '')
  }, 'hierarchy_on_insert_trigger')

  t.end()
})
