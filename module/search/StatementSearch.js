const _ = require('lodash')
const FTSQuery = require('./FTSQuery')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementSearch extends SqliteStatement {
  _selectStatement (params) {
    params.fts = new FTSQuery(params.text, params).toString()
    return this.statement
  }
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        SELECT source, id, name
        FROM ${dbname}.search
        WHERE name MATCH @fts
        GROUP BY source, id
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
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementSearch
