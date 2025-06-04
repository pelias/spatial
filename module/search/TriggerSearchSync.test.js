const tap = require('tap')
const common = require('../../test/common')
const SqliteIntrospect = require('../../sqlite/SqliteIntrospect')
const SearchModule = require('./SearchModule')
const NameModule = require('../name/NameModule')
const TriggerSearchSync = require('./TriggerSearchSync')

const filter = function (t) { return t.name.startsWith('search_sync_') }

tap.test('create & drop', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // set up name module
  let name = new NameModule(db)
  name.setup()

  // trigger does not exist
  t.notOk(introspect.triggers('name').filter(filter).length, 'prior state')

  // create trigger
  let trigger = new TriggerSearchSync()
  trigger.create(db)

  // trigger exists
  t.equal(introspect.triggers('name').filter(filter).length, 3, 'create')

  // drop trigger
  trigger.drop(db)

  // trigger does not exist
  t.notOk(introspect.triggers('name').filter(filter).length, 'drop')

  t.end()
})

tap.test('definition', (t) => {
  let db = common.tempDatabase()
  let introspect = new SqliteIntrospect(db)

  // set up name module
  let name = new NameModule(db)
  name.setup()

  // set up search module
  let search = new SearchModule(db)
  search.setup()

  // test triggers
  let triggers = introspect.triggers('name').filter(filter)

  // search_sync_insert
  t.same(triggers[0], {
    type: 'trigger',
    name: 'search_sync_insert',
    tbl_name: 'name',
    rootpage: 0,
    sql: `
        CREATE TRIGGER IF NOT EXISTS search_sync_insert
        AFTER INSERT ON main.name BEGIN
          INSERT INTO search(rowid, source, id, lang, tag, name)
          VALUES (NEW.rowid, NEW.source, NEW.id, NEW.lang, NEW.tag, NEW.name);
        END
      `.trim().replace(' IF NOT EXISTS', '')
  }, 'search_sync_insert')

  // search_sync_delete
  t.same(triggers[1], {
    type: 'trigger',
    name: 'search_sync_delete',
    tbl_name: 'name',
    rootpage: 0,
    sql: `
        CREATE TRIGGER IF NOT EXISTS search_sync_delete
        AFTER DELETE ON main.name BEGIN
          INSERT INTO search(search, rowid, source, id, lang, tag, name)
          VALUES('delete', OLD.rowid, OLD.source, OLD.id, OLD.lang, OLD.tag, OLD.name);
        END
      `.trim().replace(' IF NOT EXISTS', '')
  }, 'search_sync_delete')

  // search_sync_update
  t.same(triggers[2], {
    type: 'trigger',
    name: 'search_sync_update',
    tbl_name: 'name',
    rootpage: 0,
    sql: `
        CREATE TRIGGER IF NOT EXISTS search_sync_update
        AFTER UPDATE ON main.name BEGIN
          INSERT INTO search(search, rowid, source, id, lang, tag, name)
          VALUES('delete', OLD.rowid, OLD.source, OLD.id, OLD.lang, OLD.tag, OLD.name);

          INSERT INTO search(rowid, source, id, lang, tag, name)
          VALUES (OLD.rowid, OLD.source, OLD.id, OLD.lang, OLD.tag, OLD.name);
        END
      `.trim().replace(' IF NOT EXISTS', '')
  }, 'search_sync_update')

  t.end()
})

tap.test('function', (t) => {
  let db = common.tempDatabase()

  // set up name module
  let name = new NameModule(db)
  name.setup()

  // set up search module
  let search = new SearchModule(db)
  search.setup()

  // table empty
  t.equal(db.prepare(`SELECT COUNT(*) AS cnt FROM search`).get().cnt, 0, 'prior state')

  // insert data in to name table (which fires the triggeer)
  name.statement.insert.run({
    source: 'example_source',
    id: 'example_id',
    lang: 'example_lang',
    tag: 'example_tag',
    abbr: 1,
    name: 'example_name'
  })

  // trigger has populated the search index
  t.same(db.prepare(`SELECT source, id, name FROM search`).all(), [
    {
      source: 'example_source',
      id: 'example_id',
      name: 'example_name'
    }
  ], 'insert')

  // update data in to name table (which fires the triggeer)
  db.prepare(`UPDATE name SET name = 'example_name2'`).run()

  // trigger has updated the search index
  t.same(db.prepare(`SELECT source, id, name FROM search`).all(), [
    {
      source: 'example_source',
      id: 'example_id',
      name: 'example_name2'
    }
  ], 'update')

  // update data in to name table (which fires the triggeer)
  db.prepare(`DELETE FROM name WHERE name = 'example_name2'`).run()

  // trigger removed the entry from search index
  t.same(db.prepare(`SELECT source, id, name FROM search`).all(), [], 'delete')

  t.end()
})
