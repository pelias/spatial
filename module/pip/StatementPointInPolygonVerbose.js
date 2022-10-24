const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementPeliasView extends SqliteStatement {
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
            FROM name
            WHERE source = place.source
            AND id = place.id
            AND lang = 'und'
            AND tag = 'default'
            AND abbr = 0
            LIMIT 1
          ) AS name,
          (
            SELECT name
            FROM name
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
              FROM name
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
            FROM name
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
              FROM name
              WHERE source = place.source
              AND id = place.id
              AND abbr = 1
              GROUP BY name -- dedupe
              LIMIT (@aliaslimit + 1)
            )
            WHERE @aliaslimit > 0
          ) AS abbrs
        FROM ${dbname}.point_in_polygon AS pip
        LEFT JOIN ${dbname}.place USING (source, id)
        LEFT JOIN ${dbname}.geometry AS boundary USING (source, id)
        LEFT JOIN ${dbname}.geometry AS centroid USING (source, id)
        LEFT JOIN ${dbname}.geometry AS envelope USING (source, id)
        WHERE search_frame = MakePoint( @lon, @lat, 4326 )
        AND INTERSECTS( pip.geom, MakePoint( @lon, @lat, 4326 ) )
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
        ORDER BY place.type ASC
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementPeliasView
