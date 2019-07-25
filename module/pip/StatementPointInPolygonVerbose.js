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
            MbrMinX( g3.geom ) || ',' || MbrMinY( g3.geom ) || ',' ||
            MbrMaxX( g3.geom ) || ',' || MbrMaxY( g3.geom )
          ) AS bounds,
          (
            X( g2.geom ) || ',' || Y( g2.geom )
          ) AS centroid,
          (
            SELECT name
            FROM name
            WHERE source = place.source
            AND id = place.id
            AND abbr = 0
            ORDER BY (
              CASE 
                WHEN UPPER(lang) = 'ENG' THEN 1
                WHEN UPPER(lang) = 'UND' THEN 2
                ELSE 3
              END
            ), (
              CASE 
                WHEN UPPER(tag) = 'PREFERRED' THEN 1
                WHEN UPPER(tag) = 'DEFAULT' THEN 2
                ELSE 3
              END
            )
            LIMIT 1
          ) AS name,
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
            AND abbr = 1
            ORDER BY (
              CASE 
                WHEN UPPER(lang) = 'ENG' THEN 1
                WHEN UPPER(lang) = 'UND' THEN 2
                ELSE 3
              END
            ), (
              CASE 
                WHEN UPPER(tag) = 'PREFERRED' THEN 1
                WHEN UPPER(tag) = 'DEFAULT' THEN 2
                ELSE 3
              END
            )
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
        LEFT JOIN ${dbname}.geometry g1 USING (source, id)
        LEFT JOIN ${dbname}.geometry g2 USING (source, id)
        LEFT JOIN ${dbname}.geometry g3 USING (source, id)
        WHERE search_frame = MakePoint( @lon, @lat, 4326 )
        AND INTERSECTS( pip.geom, MakePoint( @lon, @lat, 4326 ) )
        AND (
          CASE
            WHEN @wofonly <> 1 THEN 1
            WHEN place.source = 'wof' THEN 1
            ELSE 0
          END
        )
        AND place.class = 'admin'
        AND place.id > 0 -- do not return planet or invalid placetypes
        AND g1.role = 'boundary'
        AND g2.role = 'centroid'
        AND g3.role = 'envelope'
        ORDER BY place.type ASC
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementPeliasView
