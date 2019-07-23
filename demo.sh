#!/bin/bash
DATABASE='/data/wof/sqlite/whosonfirst-data-admin-nz-latest.db'
#DATABASE='/data/wof/sqlite/whosonfirst-data-admin-us-latest.db'
QUERY='SELECT json_extract(body, "$") FROM geojson'

# remove prior copies of database
rm -f geo.db

# run wof import
sqlite3 "${DATABASE}" "${QUERY}" | node bin/spatial.js --db='geo.db' 'import' 'whosonfirst'

# run osm import
# gzcat /data/geoengine/osm.jsonl.gz | head -n10000 | node bin/spatial.js --db='geo.db' 'import' 'osmium'

# run zcta import
# gzcat /data/zcta/tl_2018_us_zcta510.geojsonl.gz | node bin/spatial.js --db='geo.db' 'import' 'zcta'
