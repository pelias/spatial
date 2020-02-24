#!/bin/bash
DATABASE='/data/wof/sqlite/whosonfirst-data-admin-nz-latest.db'
#DATABASE='/data/wof/sqlite/whosonfirst-data-admin-us-latest.db'
#OSM_FILE='/data/geoengine/osm.jsonl.gz'
OSM_FILE='/data/geofabrik-germany-2019.11.23.osmium.boundaries.geojsonl.gz'
QUERY='SELECT json_extract(body, "$") FROM geojson'

# remove prior copies of database
rm -f geo.db

# run wof import
# sqlite3 "${DATABASE}" "${QUERY}" | node bin/spatial.js --db='geo.db' 'import' 'whosonfirst'

# run osm import
gzcat "${OSM_FILE}" | node bin/spatial.js --db='geo.db' 'import' 'osmium'

# run zcta import
# gzcat /data/zcta/tl_2018_us_zcta510.geojsonl.gz | node bin/spatial.js --db='geo.db' 'import' 'zcta'
