#!/bin/bash
set -euxo pipefail

INSTALL_DIR=${RUNTIME:='/opt/spatial'}
TEMP_DIR="$(pwd)/tmp"
mkdir -p "${INSTALL_DIR}"
mkdir -p "${TEMP_DIR}"

# download amalgamation and decompress it
cd "${TEMP_DIR}"
curl -O https://www.sqlite.org/2020/sqlite-amalgamation-3310100.zip
unzip sqlite-amalgamation-3310100.zip
rm sqlite-amalgamation-3310100.zip
rm -rf sqlite3
mv sqlite-amalgamation-3310100 sqlite3

# add our custom compile-time options to the amalgamation
2>&1 echo 'add custom compile-time options'
cat << EOF > sqlite3/sqlite3.patch.c
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
cat sqlite3/sqlite3.c >> sqlite3/sqlite3.patch.c

# replace sqlite3.c
2>&1 echo 'replace sqlite3.c'
mv sqlite3/sqlite3.patch.c sqlite3/sqlite3.c

# compile steps
cd sqlite3

## shared libs (sqlite.o && libsqlite3.so)
2>&1 echo 'compile sqlite shared lib'
gcc -c -fPIC sqlite3.c -o sqlite3.o
gcc sqlite3.o -shared -o libsqlite3.so

## executable binary (sqlite)
2>&1 echo 'compile sqlite binary'
gcc shell.c sqlite3.c -lpthread -ldl -lm && mv a.out sqlite3

## install headers
mkdir -p "${INSTALL_DIR}/include"
cp *.h "${INSTALL_DIR}/include"

## keep source files
mkdir -p "${INSTALL_DIR}/src"
cp *.h "${INSTALL_DIR}/src"
cp *.c "${INSTALL_DIR}/src"

## install libs
mkdir -p "${INSTALL_DIR}/lib"
cp *.o "${INSTALL_DIR}/lib"
cp *.so "${INSTALL_DIR}/lib"

## install binaries
mkdir -p "${INSTALL_DIR}/bin"
cp sqlite3 "${INSTALL_DIR}/bin"

# clean up
rm -rf "${TEMP_DIR}/sqlite3"
