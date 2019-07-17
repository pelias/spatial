const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementFetch extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        SELECT key, value
        FROM ${dbname}.property
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
    return res.reduce((memo, item) => {
      memo[ item.key ] = item.value
      return memo
    }, {})
  }
}

module.exports = StatementFetch
