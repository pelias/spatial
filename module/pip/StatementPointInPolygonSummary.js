const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

/**
 * This view uses the 'summary' table for performance.
 */

class StatementPointInPolygonSummary extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        SELECT
          summary.source,
          summary.id,
          summary.type,
          summary.bounds,
          summary.centroid,
          summary.name,
          summary.abbr,
          (
            SELECT json_group_object(parent_type, json(parent_obj))
            FROM (
              SELECT
                parent.type AS parent_type,
                json_object(
                  'id', parent.id,
                  'name', parent.name,
                  'abbr', parent.abbr,
                  'centroid', parent.centroid,
                  'bounds', parent.bounds
                ) AS parent_obj
              FROM ${dbname}.hierarchy
              INNER JOIN ${dbname}.summary AS parent ON (
                hierarchy.parent_source = parent.source AND
                hierarchy.parent_id = parent.id
              )
              WHERE hierarchy.parent_id != hierarchy.child_id
              AND hierarchy.branch = 'wof:0'
              AND child_source = summary.source
              AND child_id = summary.id
          )
        ) AS hierarchy
        FROM ${dbname}.point_in_polygon AS pip
        LEFT JOIN ${dbname}.summary AS summary USING (source, id)
        WHERE search_frame = MakePoint( @lon, @lat, 4326 )
        AND ST_Intersects(pip.geom, MakePoint( @lon, @lat, 4326 ))
        AND LOWER(pip.role) = 'boundary'
        AND summary.class = 'admin'
        AND summary.id > 0 -- do not return planet or invalid placetypes
        GROUP BY summary.source, summary.id
        ORDER BY summary.type ASC
        LIMIT 1000
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementPointInPolygonSummary
