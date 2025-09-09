class Module {
  constructor (db) {
    this.db = db
    this.init = {}
    this.table = {}
    this.index = {}
    this.statement = {}
  }
  setup (config) {
    // perform init operations
    for (let name in this.init) {
      this.init[name].create(this.db, config)
    }

    if (!config || config.readonly !== true) {
      // create tables
      for (let name in this.table) {
        this.table[name].create(this.db, config)
      }

      // create indices
      for (let name in this.index) {
        this.index[name].create(this.db, config)
      }

      // create views
      for (let name in this.view) {
        this.view[name].create(this.db, config)
      }

      // create triggers
      for (let name in this.trigger) {
        this.trigger[name].create(this.db, config)
      }
    }

    // prepare statements
    for (let name in this.statement) {
      this.statement[name].create(this.db, config)
    }
  }
  merge (fromDbName, toDbName) {
    for (let name in this.table) {
      if (typeof this.table[name].merge === 'function') {
        this.table[name].merge(this.db, fromDbName, toDbName || 'main')
      }
    }
  }
  close (config) {
    [this.init, this.table, this.index, this.statement]
      .map(p => Object.values(p).filter(m => typeof m.close === 'function'))
      .flat().forEach(m => m.close(this.db, config))
  }
}

module.exports = Module
