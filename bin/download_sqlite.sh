#!/bin/bash

# run tests with pipefail to avoid false passes
# see https://github.com/pelias/pelias/issues/744
set -o pipefail

# clean up directory
rm -rf amalgamation
mkdir amalgamation

# download amalgamation and decompress it
cd amalgamation
curl -O https://www.sqlite.org/2020/sqlite-amalgamation-3310100.zip
unzip sqlite-amalgamation-3310100.zip
rm sqlite-amalgamation-3310100.zip

# add our custom compile-time options to the amalgamation
2>&1 echo 'add custom compile-time options'
cat << EOF > sqlite-amalgamation-3310100/sqlite3.patch.c
#define SQLITE_DQS 0
#define SQLITE_THREADSAFE 0
#define SQLITE_DEFAULT_MEMSTATUS 0
#define SQLITE_TRACE_SIZE_LIMIT 32
#define SQLITE_USE_URI 1
#define SQLITE_ENABLE_COLUMN_METADATA 1
#define SQLITE_ENABLE_UPDATE_DELETE_LIMIT 1
#define SQLITE_ENABLE_STAT4 1
#define SQLITE_ENABLE_FTS3_PARENTHESIS 1
#define SQLITE_ENABLE_FTS3 1
#define SQLITE_ENABLE_FTS4 1
#define SQLITE_ENABLE_FTS5 1
#define SQLITE_ENABLE_JSON1 1
#define SQLITE_ENABLE_RTREE 1
#define SQLITE_INTROSPECTION_PRAGMAS 1
#define SQLITE_SOUNDEX 1
EOF

# append sqlite3.c
cat sqlite-amalgamation-3310100/sqlite3.c >> sqlite-amalgamation-3310100/sqlite3.patch.c

# replace sqlite3.c
2>&1 echo 'replace sqlite3.c'
mv sqlite-amalgamation-3310100/sqlite3.patch.c sqlite-amalgamation-3310100/sqlite3.c
