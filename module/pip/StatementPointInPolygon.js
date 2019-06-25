const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementPointInPolygon extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        SELECT document.*
        FROM ${dbname}.point_in_polygon AS pip
        LEFT JOIN document USING ( id, source )
        WHERE search_frame = MakePoint( @lon, @lat, 4326 )
        AND INTERSECTS( geom, MakePoint( @lon, @lat, 4326 ) )
        AND document.source IS NOT NULL
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementPointInPolygon
