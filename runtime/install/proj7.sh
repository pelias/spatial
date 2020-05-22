#!/bin/bash
set -euxo pipefail

INSTALL_DIR=${RUNTIME:='/opt/spatial'}
TEMP_DIR="$(pwd)/tmp"
mkdir -p "${INSTALL_DIR}"

# download sources
DOWNLOAD_URL='https://download.osgeo.org/proj/proj-7.0.1.tar.gz'
rm -rf "${TEMP_DIR}/proj7"
mkdir -p "${TEMP_DIR}/proj7"
curl "${DOWNLOAD_URL}" | tar -xz --strip-components=1 -C "${TEMP_DIR}/proj7"

# installer requires the sqlite3 binary
export PATH="${INSTALL_DIR}/bin:${PATH}"

# link sqlite3
export SQLITE3_CFLAGS="-I${INSTALL_DIR}/include"
export SQLITE3_LIBS="-L${INSTALL_DIR}/lib -lsqlite3"

# link libtiff
export TIFF_CFLAGS="-I${INSTALL_DIR}/include"
export TIFF_LIBS="-L${INSTALL_DIR}/lib -ltiff"

# create data dir
mkdir -p "${INSTALL_DIR}/data"

# compile
cd "${TEMP_DIR}/proj7"
./configure \
  --prefix="${INSTALL_DIR}" \
  --datadir="${INSTALL_DIR}/data" \
  --enable-static=no

make -j8
make install

# clean up
rm -rf "${TEMP_DIR}/proj7"
