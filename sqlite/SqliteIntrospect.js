const _ = require('lodash')

class SqliteIntrospect {
  constructor (db) {
    this.db = db
  }
  master (options) {
    try {
      let dbname = _.get(options, 'database', 'main')
      return this.db.prepare(`SELECT * FROM ${dbname}.sqlite_master`).all()
    } catch (e) {
      this.error('INTROSPECT MASTER TABLE', e)
    }
  }
  tables (options) {
    try {
      return this.master(options).filter(r => r.type === 'table').map(row => row.name)
    } catch (e) {
      this.error('INTROSPECT TABLE LIST', e)
    }
  }
  columns (tablename, options) {
    try {
      let dbname = _.get(options, 'database', 'main')
      return this.db.prepare(`PRAGMA ${dbname}.table_info('${tablename}')`).all()
    } catch (e) {
      this.error('INTROSPECT COLUMN LIST', e)
    }
  }
  indices (tablename, options) {
    try {
      let dbname = _.get(options, 'database', 'main')
      return this.db.prepare(`PRAGMA ${dbname}.index_list('${tablename}')`).all()
    } catch (e) {
      this.error('INTROSPECT INDEX LIST', e)
    }
  }
  triggers (tablename, options) {
    try {
      return this.master(options).filter(r => r.type === 'trigger' && r.tbl_name === tablename)
    } catch (e) {
      this.error('INTROSPECT TRIGGER LIST', e)
    }
  }
  views (tablename, options) {
    try {
      return this.master(options).filter(r => r.type === 'view' && r.tbl_name === tablename)
    } catch (e) {
      this.error('INTROSPECT VIEW LIST', e)
    }
  }
  geometryColumns (tablename, options) {
    try {
      let dbname = _.get(options, 'database', 'main')
      return this.db.prepare(`SELECT * FROM ${dbname}.geometry_columns WHERE f_table_name = '${tablename}'`).all()
    } catch (e) {
      this.error('INTROSPECT GEOMETRY COLUMN LIST', e)
    }
  }
  error (message, error) {
    console.error('error:', message)
    console.error(error)
  }
}

module.exports = SqliteIntrospect
