const _ = require('lodash')
const SqliteTable = require('../../sqlite/SqliteTable')

class TableShardSubdivide extends SqliteTable {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE TABLE IF NOT EXISTS ${dbname}.shard_subdivide (
          nullfield INTEGER
        );
      `).run()
    } catch (e) {
      this.error('CREATE TABLE', e)
    }
  }
  drop (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        DROP TABLE IF EXISTS ${dbname}.shard_subdivide
      `).run()
    } catch (e) {
      this.error('DROP TABLE', e)
    }
  }
  merge () { /* no-op */ }
}

module.exports = TableShardSubdivide
