const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementRelationship extends SqliteStatement {
  constructor (predicate) {
    super()
    this.predicate = predicate
  }
  _selectStatement () {
    switch (this.predicate) {
      case 'intersects':
        return this.statements.intersects
      case 'contains':
        return this.statements.contains
      case 'within':
        return this.statements.within
    }
    // return this.statements.intersects
  }
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statements = {}

      // intersects
      this.statements.intersects = db.prepare(`
        SELECT t2.source, t2.id
        FROM (
          SELECT source, id, geom
          FROM ${dbname}.shard
          WHERE source = @source
          AND id = @id
          ORDER BY source, id
        ) AS t1
        JOIN shard AS t2
        WHERE t2.rowid IN (
          SELECT ROWID
          FROM SpatialIndex AS s
          WHERE s.f_table_name = 'shard'
          AND s.f_geometry_column = 'geom'
          AND s.search_frame = t1.geom
        )
        AND t1.geom IS NOT NULL
        AND t2.geom IS NOT NULL
        AND NOT (t2.source = @source AND t2.id = @id)
        AND INTERSECTS( t1.geom, t2.geom )
        GROUP BY t2.source, t2.id
        ORDER BY t2.source, t2.id
        LIMIT @limit;
      `)

      // contains
      this.statements.contains = db.prepare(`
        SELECT g2.source, g2.id
        FROM (
          SELECT t2.source, t2.id
          FROM (
            SELECT source, id, geom
            FROM main.shard
            WHERE source = @source
            AND id = @id
            ORDER BY source, id
          ) AS t1
          JOIN shard AS t2
          WHERE t2.rowid IN (
            SELECT ROWID
            FROM SpatialIndex AS s
            WHERE s.f_table_name = 'shard'
            AND s.f_geometry_column = 'geom'
            AND s.search_frame = t1.geom
          )
          AND t1.geom IS NOT NULL
          AND t2.geom IS NOT NULL
          AND NOT (t2.source = @source AND t2.id = @id)
          AND INTERSECTS( t1.geom, t2.geom )
          GROUP BY t2.source, t2.id
          ORDER BY t2.source, t2.id
        ) AS intersections
        JOIN geometry AS g1 ON (g1.source = @source AND g1.id = @id)
        JOIN geometry AS g2 ON (g2.source = intersections.source AND g2.id = intersections.id)
        WHERE GeometryType( g1.geom ) LIKE '%POLYGON'
        AND GeometryType( g2.geom ) LIKE '%POLYGON'
        AND Contains( g1.geom, g2.geom )
        GROUP BY g2.source, g2.id
        LIMIT @limit;
      `)

      // within
      this.statements.within = db.prepare(`
        SELECT g2.source, g2.id
        FROM (
          SELECT t2.source, t2.id, COLLECT(t2.geom) AS geom
          FROM (
            SELECT source, id, geom
            FROM main.shard
            WHERE source = @source
            AND id = @id
            ORDER BY source, id
          ) AS t1
          JOIN shard AS t2
          WHERE t2.rowid IN (
            SELECT ROWID
            FROM SpatialIndex AS s
            WHERE s.f_table_name = 'shard'
            AND s.f_geometry_column = 'geom'
            AND s.search_frame = t1.geom
          )
          AND t1.geom IS NOT NULL
          AND t2.geom IS NOT NULL
          AND NOT (t2.source = @source AND t2.id = @id)
          AND INTERSECTS( t1.geom, t2.geom )
          GROUP BY t2.source, t2.id
          ORDER BY t2.source, t2.id
        ) AS intersections
        JOIN geometry AS g1 ON (g1.source = @source AND g1.id = @id)
        JOIN geometry AS g2 ON (g2.source = intersections.source AND g2.id = intersections.id)
        WHERE GeometryType( g1.geom ) LIKE '%POLYGON'
        AND GeometryType( g2.geom ) LIKE '%POLYGON'
        AND Within( g1.geom, g2.geom )
        GROUP BY g2.source, g2.id
        LIMIT @limit;
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementRelationship
