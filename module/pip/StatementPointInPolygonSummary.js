const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

/**
 * Fuzzy distance allows PIP to return matches where the point is
 * not contained completely within the target polygon but is within
 * this threshold of the boundary.
 *
 * This is intended to assist in improved matching of points near
 * marine boundaries and may also help to provide matching adjacent
 * polygons to index as alternative parents for search.
 *
 * note: Interior matches are favoured as results are returned in
 * distance order ascending.
 *
 * The default value 0.001 degrees corresponds to ~111.32m longitude
 * at the equator, ~78.66m at 45°, ~55.66m at 60° and ~28.83m at 75°.
 *
 * This view uses the 'summary' table for performance.
 */
const fuzzyDistanceThreshold = 0.001

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
          CASE
            WHEN @hierarchy != 1 THEN json_object()
            ELSE (
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
                FROM main.hierarchy
                INNER JOIN main.summary AS parent ON (
                  hierarchy.parent_source = parent.source AND
                  hierarchy.parent_id = parent.id
                )
                WHERE hierarchy.parent_id != hierarchy.child_id
                AND hierarchy.branch = 'wof:0'
                AND child_source = summary.source
                AND child_id = summary.id
              )
            )
          END AS hierarchy,
        ST_Distance(pip.geom, MakePoint( @lon, @lat, 4326 )) as distance
        FROM ${dbname}.point_in_polygon AS pip
        LEFT JOIN ${dbname}.summary AS summary USING (source, id)
        WHERE search_frame = MakePoint( @lon, @lat, 4326 )
        AND distance <= ${fuzzyDistanceThreshold}
        AND (
          CASE
            WHEN @sources = '' THEN 1
            WHEN @sources like '%' || CHAR(30) || summary.source || CHAR(30) || '%' THEN 1
            ELSE 0
          END
        )
        AND summary.class = 'admin'
        AND summary.id > 0 -- do not return planet or invalid placetypes
        GROUP BY summary.source, summary.id
        ORDER BY summary.type ASC, distance ASC
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementPointInPolygonSummary
