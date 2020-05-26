#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf sqlite && mkdir -p sqlite

# download release and decompress it
curl -L 'https://www.sqlite.org/2020/sqlite-autoconf-3310100.tar.gz' \
  | tar -xz --strip-components=1 -C sqlite

# working directory
cd sqlite

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
#define SQLITE_ENABLE_ICU 1
#define SQLITE_INTROSPECTION_PRAGMAS 1
#define SQLITE_SOUNDEX 1
EOF

# append sqlite3.c
cat sqlite3.c >> sqlite3.patch.c

# replace sqlite3.c
2>&1 echo 'replace sqlite3.c'
mv sqlite3.patch.c sqlite3.c

# -- compilation --

# build flags (link dependencies)
export C_INCLUDE_PATH="${RUNTIME}/include"
export CFLAGS="-O3 $(${RUNTIME}/bin/icu-config --cflags)"
export LDFLAGS="$(${RUNTIME}/bin/icu-config --ldflags)"
export LDFLAGS="${LDFLAGS} -Wl,-rpath,${RUNTIME}/lib" # set 'rpath'

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --disable-dependency-tracking \
  --enable-shared=yes \
  --enable-static=no \
  --enable-debug=no

# compile and install in runtime directory
make -j8
make install-strip

## generate DYLIB shared lib on Mac
if [[ "$OSTYPE" == "darwin"* ]]; then
  clang -dynamiclib $LDFLAGS -Os -Wl,-install_name,@rpath/libsqlite3.dylib -current_version 308.4 -compatibility_version 9.0 -mmacosx-version-min=10.9 -o libsqlite3.dylib .libs/sqlite3.o
  cp libsqlite3.dylib "${RUNTIME}/lib"
fi

## keep a copy of amalgamation source files
mkdir -p "${RUNTIME}/src"
cp sqlite3.h "${RUNTIME}/src"
cp sqlite3.c "${RUNTIME}/src"

## test binary correctly linked in empty env
env -i "${RUNTIME}/bin/sqlite3" :memory: 'SELECT sqlite_version()'

# clean up
rm -rf /tmp/sqlite3
