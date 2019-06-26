const Sqlite = require('./Sqlite')
class SqliteStatement extends Sqlite {
  _selectStatement () { return this.statement }
  run () {
    let stmt = this._selectStatement.apply(this, arguments)
    return stmt.run.apply(stmt, arguments)
  }
  get () {
    let stmt = this._selectStatement.apply(this, arguments)
    return stmt.get.apply(stmt, arguments)
  }
  all () {
    let stmt = this._selectStatement.apply(this, arguments)
    return stmt.all.apply(stmt, arguments)
  }
}

module.exports = SqliteStatement
