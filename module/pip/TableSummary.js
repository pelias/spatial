const _ = require('lodash')
const SqliteTable = require('../../sqlite/SqliteTable')

/**
 * The summary table is used to oiptimize PIP queries
 * by avoiding running the JOIN operations at query-time.
 */

class TableSummary extends SqliteTable {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        CREATE TABLE IF NOT EXISTS ${dbname}.summary (
          source TEXT NOT NULL,
          id TEXT NOT NULL,
          class TEXT NOT NULL,
          type TEXT NOT NULL,
          name TEXT NOT NULL,
          abbr TEXT,
          centroid TEXT NOT NULL,
          bounds TEXT NOT NULL,
          PRIMARY KEY (source, id)
        )
      `).run()
    } catch (e) {
      this.error('CREATE TABLE', e)
    }
  }
  drop (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`
        DROP TABLE IF EXISTS ${dbname}.summary
      `).run()
    } catch (e) {
      this.error('DROP TABLE', e)
    }
  }
  merge (db, fromDbName, toDbName) {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO ${toDbName}.summary
        SELECT * FROM ${fromDbName}.summary
      `).run()
    } catch (e) {
      this.error('MERGE TABLE', e)
    }
  }
  close (db, config) {
    if (config && config.readonly === true) { return }
    try {
      let dbname = _.get(config, 'database', 'main')
      db.prepare(`DELETE FROM ${dbname}.summary`).run()
      db.prepare(`
        INSERT INTO ${dbname}.summary
        SELECT
          source,
          id,
          class,
          type,
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
            AND lang = 'und'
            AND tag = 'default'
            AND abbr = 1
            LIMIT 1
          ) AS abbr,
          (
            SELECT X( geom ) || ',' || Y( geom )
            FROM ${dbname}.geometry
            WHERE source = place.source
            AND id = place.id
            AND role = 'centroid'
            AND geom != ''
            LIMIT 1
          ) AS centroid,
          (
            SELECT
              MbrMinX( geom ) || ',' || MbrMinY( geom ) || ',' ||
              MbrMaxX( geom ) || ',' || MbrMaxY( geom )
            FROM ${dbname}.geometry
            WHERE source = place.source
            AND id = place.id
            AND role = 'envelope'
            AND geom != ''
            LIMIT 1
          ) AS bounds
        FROM place
        WHERE centroid IS NOT NULL
        AND bounds IS NOT NULL
      `).run()
    } catch (e) {
      this.error('POPULATE TABLE', e)
    }
  }
}

module.exports = TableSummary
