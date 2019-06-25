const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class TriggerComplexity extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE TRIGGER IF NOT EXISTS shard_complexity_trigger
        AFTER INSERT ON ${dbname}.shard
        WHEN NEW.complexity IS NULL
        BEGIN
          UPDATE shard
          SET complexity = IFNULL( ST_NPoints( geom ), 0 )
          WHERE shard.rowid = NEW.rowid
          AND complexity IS NULL;
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
        DROP TRIGGER IF EXISTS ${dbname}.shard_complexity_trigger
      `).run()
    } catch (e) {
      this.error('DROP TRIGGER', e)
    }
  }
}

module.exports = TriggerComplexity
