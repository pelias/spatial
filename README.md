# Docker Development

```
# build image
docker build -t 'pelias/spatial' .
```

```
# run environment tests
docker run --rm -it pelias/spatial npm test environment
```

```
# run tests
docker run --rm -it pelias/spatial npm test
```

```
# run import
INGRESS='/data/wof/sqlite/whosonfirst-data-admin-nz-latest.db'
EXTRACT_QUERY='SELECT json_extract(body, "$") FROM geojson'

sqlite3 "${INGRESS}" "${EXTRACT_QUERY}" | docker run --rm -i -v "${PWD}:/data" pelias/spatial --db='/data/geo.docker.db' 'import' 'whosonfirst'
```

```
# run point-in-polygon query
docker run --rm -i -v "${PWD}:/data" pelias/spatial --db='/data/geo.docker.db' 'pip' 174.766843 -41.288788
```

# Local Development

On Mac:

```
# install C dependencies
brew install sqlite3 libspatialite

# install node dependencies
npm install
npm run postinstall
```

```
# run environment tests
npm test environment
```

```
# run tests
npm test
```

```
# run import
INGRESS='/data/wof/sqlite/whosonfirst-data-admin-nz-latest.db'
EXTRACT_QUERY='SELECT json_extract(body, "$") FROM geojson'

sqlite3 "${INGRESS}" "${EXTRACT_QUERY}" | node bin/spatial.js --db='geo.local.db' 'import' 'whosonfirst'
```

```
# run point-in-polygon query
node bin/spatial.js --db='geo.local.db' 'pip' 174.766843 -41.288788
```