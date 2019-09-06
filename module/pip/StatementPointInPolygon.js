const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementPointInPolygon extends SqliteStatement {
  _selectStatement (query) {
    let hasRole = _.get(query, 'role', '').length > 1

    if (hasRole) { return this.statements.fetchWithRole }
    return this.statements.fetch
  }
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statements = {}

      // fetch
      this.statements.fetch = db.prepare(`
        SELECT place.*
        FROM ${dbname}.point_in_polygon AS pip
        LEFT JOIN place USING (source, id)
        WHERE search_frame = MakePoint( @lon, @lat, 4326 )
        AND INTERSECTS( pip.geom, MakePoint( @lon, @lat, 4326 ) )
        AND place.source IS NOT NULL
        LIMIT @limit
      `)

      // fetch filter by role
      this.statements.fetchWithRole = db.prepare(`
        SELECT source, id, class, type FROM (
          SELECT source, id, class, type, role
          FROM ${dbname}.point_in_polygon AS pip
          LEFT JOIN place USING (source, id)
          WHERE search_frame = MakePoint( @lon, @lat, 4326 )
          AND INTERSECTS( pip.geom, MakePoint( @lon, @lat, 4326 ) )
          AND place.source IS NOT NULL
          LIMIT @limit
        )
        WHERE role = @role
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementPointInPolygon
