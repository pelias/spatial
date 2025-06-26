const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementInsert extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      let simplify = _.get(config, 'module.geometry.simplify', 0.0)
      if (simplify > 0.0) {
        this.statement = db.prepare(`
          INSERT OR REPLACE INTO ${dbname}.geometry (
            source,
            id,
            role,
            geom,
          ) VALUES (
            @source,
            @id,
            @role,
            SimplifyPreserveTopology( GeomFromWKB( @geom, 4326 ), ${simplify} )
          )
        `)
      } else {
        this.statement = db.prepare(`
          INSERT OR REPLACE INTO ${dbname}.geometry (
            source,
            id,
            role,
            geom
          ) VALUES (
            @source,
            @id,
            @role,
            GeomFromWKB( @geom, 4326 )
          )
        `)
      }
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementInsert
