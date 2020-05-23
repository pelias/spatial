#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf proj7 && mkdir -p proj7

# download release and decompress it
curl -L 'https://download.osgeo.org/proj/proj-7.0.1.tar.gz' \
  | tar -xz --strip-components=1 -C proj7

# working directory
cd proj7

# installer requires the sqlite3 binary
export PATH="${RUNTIME}/bin:${PATH}"

# link sqlite3
export SQLITE3_CFLAGS="-I${RUNTIME}/include"
export SQLITE3_LIBS="-L${RUNTIME}/lib -lsqlite3"

# link libtiff
export TIFF_CFLAGS="-I${RUNTIME}/include"
export TIFF_LIBS="-L${RUNTIME}/lib -ltiff"

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --datadir="${RUNTIME}/data" \
  --enable-static=no

# compile and install in runtime directory
make -j8
make install-strip

# clean up
rm -rf /tmp/proj7
