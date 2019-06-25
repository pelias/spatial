const _ = require('lodash')
const SqliteIndex = require('../../sqlite/SqliteIndex')

class IndexComplexity extends SqliteIndex {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE INDEX IF NOT EXISTS ${dbname}.shard_idx_complexity 
        ON shard(complexity)
      `).run()
    } catch (e) {
      this.error('CREATE INDEX', e)
    }
  }
  drop (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        DROP INDEX IF EXISTS ${dbname}.shard_idx_complexity
      `).run()
    } catch (e) {
      this.error('DROP INDEX', e)
    }
  }
}

module.exports = IndexComplexity
