# Docker Development

```bash
# build image
docker build -t 'pelias/spatial' .
```

```bash
# run environment tests
docker run --rm -it --entrypoint=npm pelias/spatial test environment
```

```bash
# run tests
docker run --rm -it --entrypoint=npm pelias/spatial test
```

```bash
# create empty spatial database
docker run --rm -i -v "${PWD}:/data" pelias/spatial import whosonfirst --db=/data/empty.db --file=/dev/null
```

```bash
# merge two databases
docker run --rm -i -v "${PWD}:/data" pelias/spatial merge --db=/data/empty.db /data/external.db
```

```bash
# run import
ingress() {
  WOFDB='/data/wof/sqlite/whosonfirst-data-admin-nz-latest.db'
  EXTRACT_QUERY='SELECT json_extract(body, "$") FROM geojson'
  sqlite3 "${WOFDB}" "${EXTRACT_QUERY}"
}

ingress | docker run --rm -i -v "${PWD}:/data" pelias/spatial --db=/data/geo.docker.db import whosonfirst
```

```bash
# run point-in-polygon query
docker run --rm -i -v "${PWD}:/data" pelias/spatial --db=/data/geo.docker.db pip 174.766843 -41.288788
```

# Local Development

On Mac:

```bash
# install C dependencies
brew install sqlite3 libspatialite

# install node dependencies
npm install
npm run postinstall
```

```bash
# run environment tests
npm test environment
```

```bash
# run tests
npm test
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
# run import
ingress() {
  WOFDB='/data/wof/sqlite/whosonfirst-data-admin-nz-latest.db'
  EXTRACT_QUERY='SELECT json_extract(body, "$") FROM geojson'
  sqlite3 "${WOFDB}" "${EXTRACT_QUERY}"
}

ingress | node bin/spatial.js --db=geo.local.db import whosonfirst
```

```bash
# run point-in-polygon query
node bin/spatial.js --db=geo.local.db pip 174.766843 -41.288788
```