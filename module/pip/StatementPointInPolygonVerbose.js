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
 */
const fuzzyDistanceThreshold = 0.001

class StatementPeliasVerbose extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        SELECT
          place.source,
          place.id,
          place.type,
          (
            MbrMinX( envelope.geom ) || ',' || MbrMinY( envelope.geom ) || ',' ||
            MbrMaxX( envelope.geom ) || ',' || MbrMaxY( envelope.geom )
          ) AS bounds,
          (
            X( centroid.geom ) || ',' || Y( centroid.geom )
          ) AS centroid,
          (
            SELECT name
            FROM ${dbname}.name
            WHERE source = place.source
            AND id = place.id
            AND lang = 'und'
            AND tag = 'default'
            AND abbr = 0
            LIMIT 1
          ) AS name,
          (
            SELECT name
            FROM ${dbname}.name
            WHERE source = place.source
            AND id = place.id
            AND lang = @lang
            AND tag IN ('default', 'preferred')
            AND abbr = 0
            LIMIT 1
          ) AS name_localized,
          (
            SELECT GROUP_CONCAT(name, CHAR(30))
            FROM (
              SELECT name
              FROM ${dbname}.name
              WHERE source = place.source
              AND id = place.id
              AND abbr = 0
              GROUP BY name -- dedupe
              LIMIT (@aliaslimit + 1)
            )
            WHERE @aliaslimit > 0
          ) AS names,
          (
            SELECT name
            FROM ${dbname}.name
            WHERE source = place.source
            AND id = place.id
            AND lang = 'und'
            AND tag = 'default'
            AND abbr = 1
            LIMIT 1
          ) AS abbr,
          (
            SELECT GROUP_CONCAT(name, CHAR(30))
            FROM (
              SELECT name
              FROM ${dbname}.name
              WHERE source = place.source
              AND id = place.id
              AND abbr = 1
              GROUP BY name -- dedupe
              LIMIT (@aliaslimit + 1)
            )
            WHERE @aliaslimit > 0
          ) AS abbrs,
          CASE
            WHEN @hierarchy != 1 THEN json_object()
            ELSE (
              SELECT json_group_object(parent_type, json(parent_obj))
              FROM (
                SELECT
                  parent.type AS parent_type,
                  json_insert(
                    json_object(),
                    '$.id', parent.id,
                    '$.name', (
                      SELECT name
                      FROM ${dbname}.name
                      WHERE source = parent.source
                      AND id = parent.id
                      AND lang = 'und'
                      AND tag = 'default'
                      AND abbr = 0
                      LIMIT 1
                    ),
                    '$.abbr', (
                      SELECT name
                      FROM ${dbname}.name
                      WHERE source = parent.source
                      AND id = parent.id
                      AND lang = 'und'
                      AND tag = 'default'
                      AND abbr = 1
                      LIMIT 1
                    ),
                    '$.centroid', (
                      SELECT X( geom ) || ',' || Y( geom )
                      FROM ${dbname}.geometry
                      WHERE source = parent.source
                      AND id = parent.id
                      AND role = 'centroid'
                      AND geom != ''
                      LIMIT 1
                    ),
                    '$.bounds', (
                      SELECT
                        MbrMinX( geom ) || ',' || MbrMinY( geom ) || ',' ||
                        MbrMaxX( geom ) || ',' || MbrMaxY( geom )
                      FROM ${dbname}.geometry
                      WHERE source = parent.source
                      AND id = parent.id
                      AND role = 'envelope'
                      AND geom != ''
                    )
                  ) AS parent_obj
                FROM ${dbname}.hierarchy
                INNER JOIN ${dbname}.place AS parent ON (
                  parent.id = parent_id AND
                  parent.source = parent_source
                )
                WHERE child_id = place.id
                AND parent_id != child_id
                AND branch = 'wof:0'
              )
            )
          END AS hierarchy,
        ST_Distance(pip.geom, MakePoint( @lon, @lat, 4326 )) as distance
        FROM ${dbname}.point_in_polygon AS pip
        LEFT JOIN ${dbname}.place USING (source, id)
        LEFT JOIN ${dbname}.geometry AS boundary USING (source, id)
        LEFT JOIN ${dbname}.geometry AS centroid USING (source, id)
        LEFT JOIN ${dbname}.geometry AS envelope USING (source, id)
        WHERE search_frame = MakePoint( @lon, @lat, 4326 )
        AND distance <= ${fuzzyDistanceThreshold}
        AND (
          CASE
            WHEN @sources = '' THEN 1
            WHEN @sources like '%' || CHAR(30) || place.source || CHAR(30) || '%' THEN 1
            ELSE 0
          END
        )
        AND place.class = 'admin'
        AND place.id > 0 -- do not return planet or invalid placetypes
        AND boundary.role = 'boundary' AND boundary.geom != ''
        AND centroid.role = 'centroid' AND centroid.geom != ''
        AND envelope.role = 'envelope' AND envelope.geom != ''
        GROUP BY place.source, place.id
        ORDER BY place.type ASC, distance ASC
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementPeliasVerbose
