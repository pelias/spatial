const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementInsert extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      let simplify = _.get(config, 'module.shard.simplify', 0.0)
      if (simplify > 0.0) {
        this.statement = db.prepare(`
          INSERT OR REPLACE INTO ${dbname}.shard (
            source,
            id,
            path,
            geom
          ) VALUES (
            @source,
            @id,
            '0',
            CastToMultiPolygon( SimplifyPreserveTopology( GeomFromWKB( @geom, 4326 ), ${simplify} ) )
          )
        `)
      } else {
        this.statement = db.prepare(`
          INSERT OR REPLACE INTO ${dbname}.shard (
            source,
            id,
            path,
            geom
          ) VALUES (
            @source,
            @id,
            '0',
            CastToMultiPolygon( GeomFromWKB( @geom, 4326 ) )
          )
        `)
      }
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementInsert
