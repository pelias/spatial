const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementFetch extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        SELECT lang, tag, abbr, name
        FROM ${dbname}.name
        WHERE source = @source
        AND id = @id
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
  // reduce results (convert from array to object)
  _transform (res) {
    return res.map(row => {
      row.abbr = (row.abbr === 1)
      return row
    })
  }
}

module.exports = StatementFetch
