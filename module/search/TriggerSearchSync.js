const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class TriggerSearchSync extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      // insert trigger
      db.prepare(`
        CREATE TRIGGER IF NOT EXISTS search_sync_insert
        AFTER INSERT ON ${dbname}.name BEGIN
          INSERT INTO search(rowid, source, id, lang, tag, name)
          VALUES (NEW.rowid, NEW.source, NEW.id, NEW.lang, NEW.tag, NEW.name);
        END
      `).run()

      // delete trigger
      db.prepare(`
        CREATE TRIGGER IF NOT EXISTS search_sync_delete
        AFTER DELETE ON ${dbname}.name BEGIN
          INSERT INTO search(search, rowid, source, id, lang, tag, name)
          VALUES('delete', OLD.rowid, OLD.source, OLD.id, OLD.lang, OLD.tag, OLD.name);
        END
      `).run()

      // update trigger
      db.prepare(`
        CREATE TRIGGER IF NOT EXISTS search_sync_update
        AFTER UPDATE ON ${dbname}.name BEGIN
          INSERT INTO search(search, rowid, source, id, lang, tag, name)
          VALUES('delete', OLD.rowid, OLD.source, OLD.id, OLD.lang, OLD.tag, OLD.name);

          INSERT INTO search(rowid, source, id, lang, tag, name)
          VALUES (OLD.rowid, OLD.source, OLD.id, OLD.lang, OLD.tag, OLD.name);
        END
      `).run()
    } catch (e) {
      this.error('CREATE TRIGGER', e)
    }
  }
  drop (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`DROP TRIGGER IF EXISTS ${dbname}.search_sync_insert`).run()
      db.prepare(`DROP TRIGGER IF EXISTS ${dbname}.search_sync_delete`).run()
      db.prepare(`DROP TRIGGER IF EXISTS ${dbname}.search_sync_update`).run()
    } catch (e) {
      this.error('DROP TRIGGER', e)
    }
  }
}

module.exports = TriggerSearchSync
