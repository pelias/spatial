#!/bin/bash
set -euxo pipefail

INSTALL_DIR=${RUNTIME:='/opt/spatial'}
TEMP_DIR="$(pwd)/tmp"
mkdir -p "${INSTALL_DIR}"

DOWNLOAD_URL='http://download.osgeo.org/geos/geos-3.8.1.tar.bz2'
rm -rf "${TEMP_DIR}/geos"
mkdir -p "${TEMP_DIR}/geos"
curl "${DOWNLOAD_URL}" | tar -xj --strip-components=1 -C "${TEMP_DIR}/geos"

cd "${TEMP_DIR}/geos"
./configure \
  --prefix="${INSTALL_DIR}" \
  --enable-static=no

make -j8
make install

# clean up
rm -rf "${TEMP_DIR}/geos"
