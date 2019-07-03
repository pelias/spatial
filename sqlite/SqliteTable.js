const Sqlite = require('./Sqlite')
class SqliteTable extends Sqlite {
  merge () { this.error('you must overload this function in your subclass') }
}

module.exports = SqliteTable
