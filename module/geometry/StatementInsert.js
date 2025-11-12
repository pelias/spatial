const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementInsert extends SqliteStatement {
  create (db, config) {
    try {
      const dbname = _.get(config, 'database', 'main')
      const simplify = _.get(config, 'module.geometry.simplify', 0.0)
      const repair = _.get(config, 'module.geometry.repair', 0)

      // parse WKB
      let sql = 'GeomFromWKB( @geom, 4326 )'

      // optionally repair broken geometries
      if (repair === 1) {
        sql = `MakeValid( ${sql} )`
      } else if (repair === 2) {
        sql = `GeosMakeValid( ${sql} )`
      }

      // optionally simplify geometries
      if (simplify > 0.0) {
        sql = `SimplifyPreserveTopology( ${sql}, ${simplify} )`
      }

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
          ${sql}
        )`)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementInsert
