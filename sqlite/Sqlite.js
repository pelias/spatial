class Sqlite {
  create () { this.error('you must overload this function in your subclass') }
  drop () { this.error('you must overload this function in your subclass') }
  error (message, error) {
    console.error('error:', message)
    console.error(error)
  }
}

module.exports = Sqlite
