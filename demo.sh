#!/bin/bash
DATABASE='/data/wof/sqlite/whosonfirst-data-admin-nz-latest.db'
QUERY='SELECT json_extract(body, "$") FROM geojson'

# remove prior copies of database
rm -f geo.db

# run import
sqlite3 "${DATABASE}" "${QUERY}" | node bin/import.js 'whosonfirst'
