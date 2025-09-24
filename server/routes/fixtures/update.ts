const fs = require('fs')
const path = require('path')
const QueryService = require('../../../service/QueryService')

// Get database path from command line arguments or environment variable
const dbPath = process.argv[2] || process.env.SPATIAL_DB_PATH || 'whosonfirst-data-admin-nz-latest.spatial.db'

// Initialize QueryService with real database
const service = new QueryService({
  readonly: true,
  filename: dbPath
})

function writeFixture(query, centroid, filename) {
  const res = query.all(centroid)
  const json = JSON.stringify(res)
  fs.writeFileSync(path.join(__dirname, filename), json)
}

writeFixture(
  service.module.pip.statement.summary,
  { lon: 175.4166635, lat: -41.221498 },
  'martinborough_summary.rows.json'
)

writeFixture(
  service.module.pip.statement.summary,
  { lon: 170.96879300000001, lat: -45.098982 },
  'oamaru_summary.rows.json'
)

writeFixture(
  service.module.pip.statement.verbose,
  {
    lon: 175.4166635,
    lat: -41.221498,
    limit: 1000,
    aliaslimit: 0,
    sources: '\u001ewof\u001e',
    lang: 'und',
    hierarchy: 1
  },
  'martinborough_verbose.rows.json'
)

writeFixture(
  service.module.pip.statement.verbose,
  {
    lon: 170.96879300000001,
    lat: -45.098982,
    limit: 1000,
    aliaslimit: 0,
    sources: '\u001ewof\u001e',
    lang: 'und',
    hierarchy: 1
  },
  'oamaru_verbose.rows.json'
)