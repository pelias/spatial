const Module = require('../Module')
const TableSearch = require('./TableSearch')
const TableSearchVocab = require('./TableSearchVocab')
const TriggerSearchSync = require('./TriggerSearchSync')
const StatementSearch = require('./StatementSearch')

class SearchModule extends Module {
  constructor (db) {
    super(db)
    this.table = {
      search: new TableSearch(),
      vocab: new TableSearchVocab()
    }
    this.statement = {
      search: new StatementSearch()
    }
    this.trigger = {
      sync: new TriggerSearchSync()
    }
  }
  insert () { /* no-op (handled by triggers) */ }
}

module.exports = SearchModule
