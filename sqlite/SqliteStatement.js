const Sqlite = require('./Sqlite')
class SqliteStatement extends Sqlite {
  run () {
    return this.statement.run.apply(this.statement, arguments)
  }
  get () {
    return this.statement.get.apply(this.statement, arguments)
  }
  all () {
    return this.statement.all.apply(this.statement, arguments)
  }
}

module.exports = SqliteStatement
