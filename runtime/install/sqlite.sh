#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf sqlite3 && mkdir -p sqlite3

# download amalgamation and decompress it
RELEASE='sqlite-amalgamation-3310100'
curl -LO "https://www.sqlite.org/2020/${RELEASE}.zip"
unzip "${RELEASE}.zip" && rm "${RELEASE}.zip"
rm -rf sqlite3 && mv "${RELEASE}" sqlite3

# working directory
cd sqlite3

# add our custom compile-time options to the amalgamation
2>&1 echo 'add custom compile-time options'
cat << EOF > sqlite3.patch.c
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
cat sqlite3.c >> sqlite3.patch.c

# replace sqlite3.c
2>&1 echo 'replace sqlite3.c'
mv sqlite3.patch.c sqlite3.c

# -- compilation --

## shared libs (sqlite.o && libsqlite3.so)
2>&1 echo 'compile sqlite shared lib'
gcc -c -fPIC sqlite3.c -o sqlite3.o
gcc sqlite3.o -shared -o libsqlite3.so

## generate DYLIB shared lib on Mac
if [[ "$OSTYPE" == "darwin"* ]]; then
  clang -dynamiclib -Os -Wl,-install_name,${RUNTIME}/lib/libsqlite3.dylib -current_version 308.4 -compatibility_version 9.0 -mmacosx-version-min=10.9 -o libsqlite3.dylib sqlite3.o
fi

## executable binary (sqlite)
2>&1 echo 'compile sqlite binary'
gcc shell.c sqlite3.c -lpthread -ldl -lm && mv a.out sqlite3

## install headers
mkdir -p "${RUNTIME}/include"
cp *.h "${RUNTIME}/include"

## install source files
mkdir -p "${RUNTIME}/src"
cp *.h "${RUNTIME}/src"
cp *.c "${RUNTIME}/src"

## install libs
mkdir -p "${RUNTIME}/lib"
cp *.o "${RUNTIME}/lib"
cp *.so "${RUNTIME}/lib"

## install binaries
mkdir -p "${RUNTIME}/bin"
cp sqlite3 "${RUNTIME}/bin"

# clean up
rm -rf /tmp/sqlite3
