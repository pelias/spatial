const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementOntology extends SqliteStatement {
  _selectStatement (query) {
    let hasClass = _.get(query, 'class', '').length > 0
    let hasType = _.get(query, 'type', '').length > 0
    if (hasClass && hasType) { return this.statements.listPlaces }
    if (hasClass) { return this.statements.enumerateTypes }
    return this.statements.enumerateClasses
  }
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statements = {}

      // enumertate classes
      this.statements.enumerateClasses = db.prepare(`
        SELECT class, COUNT(*) AS total
        FROM ${dbname}.place
        GROUP BY class
        ORDER BY class ASC
        LIMIT @limit
      `)

      // enumerate types within a class
      this.statements.enumerateTypes = db.prepare(`
        SELECT type, COUNT(*) AS total
        FROM ${dbname}.place
        WHERE class = @class
        GROUP BY type
        ORDER BY type ASC
        LIMIT @limit
      `)

      // list all places matching ontology
      this.statements.listPlaces = db.prepare(`
        SELECT source, id
        FROM ${dbname}.place
        WHERE class = @class
        AND type = @type
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementOntology
