var Database = require('better-sqlite3')
var db = Database('/tmp/foo', { memory: true })
var stmt = db.prepare(`SELECT load_extension('mod_spatialite')`)
console.log(stmt.all())
