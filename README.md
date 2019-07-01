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

sqlite3 "${INGRESS}" "${EXTRACT_QUERY}" | docker run --rm -i -v "${PWD}:/data" pelias/spatial node bin/import.js 'whosonfirst' /data/geo.docker.db
```

```
# run point-in-polygon query
docker run --rm -i -v "${PWD}:/data" pelias/spatial node bin/pip.js /data/geo.docker.db 174.766843 -41.288788
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

sqlite3 "${INGRESS}" "${EXTRACT_QUERY}" | node bin/import.js 'whosonfirst' geo.local.db
```

```
# run point-in-polygon query
node bin/pip.js geo.local.db 174.766843 -41.288788
```