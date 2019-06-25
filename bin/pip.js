const QueryService = require('../service/QueryService')

const service = new QueryService({
  readonly: true,
  filename: process.argv[2] || 'geo.db'
})

let query = {
  lon: parseFloat(process.argv[3]),
  lat: parseFloat(process.argv[4]),
  limit: 1000
}

let start = new Date().getTime()
let res = service.module.pip.statement.pip.all(query)
console.error('took', new Date().getTime() - start, 'ms')

console.error(query)
console.error(res)
