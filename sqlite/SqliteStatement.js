const Sqlite = require('./Sqlite')
class SqliteStatement extends Sqlite {
  _selectStatement () { return this.statement }
  _transform (res) { return res }
  run () {
    let stmt = this._selectStatement.apply(this, arguments)
    return this._transform(stmt.run.apply(stmt, arguments))
  }
  get () {
    let stmt = this._selectStatement.apply(this, arguments)
    return this._transform(stmt.get.apply(stmt, arguments))
  }
  all () {
    let stmt = this._selectStatement.apply(this, arguments)
    return this._transform(stmt.all.apply(stmt, arguments))
  }
}

module.exports = SqliteStatement
