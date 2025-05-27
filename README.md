# Docker Development

```bash
# build image
docker build -t 'pelias/spatial' .
```

```bash
# run environment checks
docker run --rm -it \
  --entrypoint=npm \
  pelias/spatial \
  run env_check
```

```bash
# run tests
docker run --rm -it \
  --entrypoint=npm \
  pelias/spatial \
  test
```

```bash
# generate code coverage report
docker run --rm -it \
  --entrypoint=npm \
  pelias/spatial \
  run coverage
```

```bash
# create empty spatial database
docker run --rm -i \
  -v "${PWD}:/data" \
  pelias/spatial \
  import whosonfirst --db=/data/empty.db --file=/dev/null
```

```bash
# merge two databases
docker run --rm -i \
  -v "${PWD}:/data" \
  pelias/spatial \
  merge --db=/data/empty.db /data/external.db
```

```bash
# run whosonfirst import
# note: database sourced from https://dist.whosonfirst.org/sqlite/
ingress() {
  WOFDB='/data/wof/sqlite/whosonfirst-data-admin-nz-latest.db'
  EXTRACT_QUERY='SELECT json_extract(body, "$") FROM geojson'
  sqlite3 "${WOFDB}" "${EXTRACT_QUERY}"
}

ingress | docker run --rm -i \
  -v "${PWD}:/data" \
  pelias/spatial \
  import whosonfirst --db=/data/geo.docker.db
```

```bash
# run openstreetmap import
# note: data generated using https://docs.osmcode.org/osmium/latest/
ingress() {
  EXTRACT_FILE='osmium.extract.geojsonl.gz'
  gzcat "${EXTRACT_FILE}"
}

ingress | docker run --rm -i \
  -v "${PWD}:/data" \
  pelias/spatial \
  import osmium --db=/data/geo.docker.db
```

```bash
# start the HTTP server on port 3000
docker run --rm -it \
  -v "${PWD}:/data" \
  -p 3000:3000 \
  pelias/spatial \
  server --db=/data/geo.docker.db
```

```bash
# run point-in-polygon query
docker run --rm -i \
  -v "${PWD}:/data" \
  pelias/spatial \
  pip --db=/data/geo.docker.db 174.766843 -41.288788
```

# Local Development

```bash
# run environment checks
npm run env_check
```

```bash
# run tests
npm test
```

```bash
# generate code coverage report
npm run coverage
```

```bash
# create empty spatial database
node bin/spatial.js import whosonfirst --db=empty.db --file=/dev/null
```

```bash
# merge two databases
node bin/spatial.js merge --db=/data/empty.db /data/external.db
```

```bash
# run whosonfirst import
# note: database sourced from https://dist.whosonfirst.org/sqlite/
ingress() {
  WOFDB='/data/wof/sqlite/whosonfirst-data-admin-nz-latest.db'
  EXTRACT_QUERY='SELECT json_extract(body, "$") FROM geojson'
  sqlite3 "${WOFDB}" "${EXTRACT_QUERY}"
}

ingress | node bin/spatial.js --db=geo.local.db import whosonfirst
```

```bash
# run openstreetmap import
# note: data generated using https://docs.osmcode.org/osmium/latest/
ingress() {
  EXTRACT_FILE='osmium.extract.geojsonl.gz'
  gzcat "${EXTRACT_FILE}"
}

ingress | node bin/spatial.js --db=geo.local.db import osmium
```

```bash
# start the HTTP server on port 3000
node bin/spatial.js server --db=geo.local.db
```

```bash
# run point-in-polygon query
node bin/spatial.js --db=geo.local.db pip 174.766843 -41.288788
```

# Performance Testing

For performance critial HTTP APIs we have two methods of load-testing:

## K6

For some basic tests you can use [k6](https://github.com/loadimpact/k6) to write perf tests in javascript:

```javascript
import http from 'k6/http'
const baseurl = 'http://localhost:3000/query/pip/_view/pelias'

function randomFloat(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1
}

export default function() {
  let lon = randomFloat(-180, +180, 8)
  let lat = randomFloat(-90, +90, 8)
  http.get(`${baseurl}/${lon}/${lat}`)
}
```

```bash
k6 run --vus 20 --iterations 100000 test.js
```

## Gatling

Jawg provide a [suite of stress-testing tools](https://github.com/jawg/pelias-server-stress) for benchmarking various Pelias services.

These tools are powered by [Gatling](https://gatling.io/) which can produce impressive visual charts and provide more information about where the bottlenecks are occurring (ie. disk congestion).

see https://github.com/pelias/spatial/issues/7 for examples
