const { bench, run } = require('mitata')
const pip = require('./pip_pelias')
const QueryService = require('../../service/QueryService')

// Get database path from command line arguments or environment variable
const dbPath = process.argv[2] || process.env.SPATIAL_DB_PATH || 'whosonfirst-data-admin-nz-latest.spatial.db'

// Initialize QueryService with real database
let service
try {
  service = new QueryService({
    readonly: true,
    filename: dbPath
  })
  console.log(`Benchmark using database: ${dbPath}`)
} catch (error) {
  console.error(`Failed to initialize QueryService with database: ${dbPath}`)
  console.error('Error:', error.message)
  console.error('Please provide a valid database path as the first argument or set SPATIAL_DB_PATH environment variable')
  process.exit(1)
}

// Simple response class for benchmarking
class BenchmarkResponse {
  constructor () {
    this.statusCode = 200
    this.promise = new Promise((resolve) => {
      this.resolve = resolve
    })
  }

  status (code) {
    this.statusCode = code
    return this
  }

  json (data) {
    if (this.resolve) {
      this.resolve(data)
    }
    return this
  }
}

bench('pip_pelias controller', async () => {
  const req = {
    params: {
      lon: '174.766096',
      lat: '-41.28692'
    },
    query: {},
    app: {
      locals: {
        service
      }
    }
  }

  const res = new BenchmarkResponse()
  pip.controller(req, res)
  await res.promise
})

// Run benchmarks
run()

// ~212 116.32
// 1,000,000 / 163.01 ≈ 6,134
// 1,000,000 / 118.82 ≈ 8,416.09
// 1,000,000 / 126.05 ≈ 7,933.35
// 1,000,000 / 104.89 ≈ 9,533.79
