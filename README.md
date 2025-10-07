<p align="center">
  <img height="100" src="https://raw.githubusercontent.com/pelias/design/master/logo/pelias_github/Github_markdown_hero.png">
</p>
<h3 align="center">A modular, open-source search engine for our world.</h3>
<p align="center">Pelias is a geocoder powered completely by open data, available freely to everyone.</p>
<p align="center">
<a href="https://github.com/pelias/api/actions"><img src="https://github.com/pelias/api/workflows/Continuous%20Integration/badge.svg" /></a>
<a href="https://en.wikipedia.org/wiki/MIT_License"><img src="https://img.shields.io/github/license/pelias/api?style=flat&color=orange" /></a>
<a href="https://hub.docker.com/u/pelias"><img src="https://img.shields.io/docker/pulls/pelias/api?style=flat&color=informational" /></a>
<a href="https://gitter.im/pelias/pelias"><img src="https://img.shields.io/gitter/room/pelias/pelias?style=flat&color=yellow" /></a>
</p>
<p align="center">
	<a href="https://github.com/pelias/docker">Local Installation</a> ·
        <a href="https://geocode.earth">Cloud Webservice</a> ·
	<a href="https://github.com/pelias/documentation">Documentation</a> ·
	<a href="https://gitter.im/pelias/pelias">Community Chat</a>
</p>
<details open>
<summary>What is Pelias?</summary>
<br />
Pelias is a search engine for places worldwide, powered by open data. It turns addresses and place names into geographic coordinates, and turns geographic coordinates into places and addresses. With Pelias, you’re able to turn your users’ place searches into actionable geodata and transform your geodata into real places.
<br /><br />
We think open data, open source, and open strategy win over proprietary solutions at any part of the stack and we want to ensure the services we offer are in line with that vision. We believe that an open geocoder improves over the long-term only if the community can incorporate truly representative local knowledge.
</details>

# Pelias Spatial Service

Lightweight spatial service used by Pelias — provides point-in-polygon (PIP) lookups, geometry, relationships and ontology data via a small HTTP API and demo pages.

## HTTP endpoints

All endpoints are GET endpoints unless noted. See `server/routes/*` for parameter details and exact output shape.

- GET `/place/:source/:id`
  Return place metadata by source and id.

- GET `/place/:source/:id/geometry`
  Return all geometry roles for the place.

- GET `/place/:source/:id/geometry/:role`
  Return geometry for a specific role (e.g. `intersection`, `shape`, etc.).

- GET `/place/:source/:id/relationship/intersects`
  Return places that intersect the given place.

- GET `/place/:source/:id/relationship/contains`
  Return places that contain the given place.

- GET `/place/:source/:id/relationship/within`
  Return places within the given place.

- GET `/place/:source/:id/property`
  Return properties for the place.

- GET `/place/:source/:id/name`
  Return names for the place.

- GET `/place/:source/:id/hierarchy`
  Return the administrative hierarchy for the place.

- GET `/query/pip`
  Point-in-polygon lookup (compact view). Query parameters are handled by the pip route implementation in server/routes/pip.js.

- GET `/query/pip/verbose`
  Point-in-polygon lookup (verbose view), returns detailed match records.

- GET `/query/pip/_view/pelias/:lon/:lat`
  Pelias-compatible PIP view (legacy Pelias format).  
  - Path params: lon, lat  
  - Query params: `layers` (comma-separated list) is supported by the Pelias view implementation and filters the output layers. See server/routes/pip_pelias.js for details.

- GET `/query/search`
  General spatial search endpoint (see server/routes/search.js for supported query parameters).

- GET `/ontology`
  Return top-level ontology index.

- GET `/ontology/:class`
  Return ontology entries for a class.

- GET `/ontology/:class/:type`
  Return ontology entries for a class/type pair.

Demo pages and utilities:
- GET `/explore` (static demo UI at server/demo)  
- GET `/explore/place/:source/:id ` 
- GET `/explore/pip` 
- GET `/explore/ontology`
- GET `/explore/ontology/:class/:type`

Root:
- GET `/` redirects to `/explore/pip`

## Examples

Pelias PIP view (Pelias-compatible response):

    curl -s "http://localhost:3000/query/pip/_view/pelias/170.97/-45.09?layers=locality,region"

Simple place lookup:

    curl -s "http://localhost:3000/place/whosonfirst/85633345"

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

Install dependencies from homebrew (macos):

```bash
# install a modern version of nodejs
brew install node@23
brew link --overwrite node@23
brew postinstall node

# install sqlite3 and libspatialite
brew install sqlite3 libspatialite
```

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
