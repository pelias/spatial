
const _ = require('lodash')
const TermQuery = require('./TermQuery')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementSearch extends SqliteStatement {
  _selectStatement (params) {
    params.term = new TermQuery(params.text, params).toString()
    return this.statement
  }
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        SELECT source, id, name
        FROM ${dbname}.name
        WHERE name LIKE @term
        GROUP BY source, id
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementSearch
