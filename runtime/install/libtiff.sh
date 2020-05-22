#!/bin/bash
set -euxo pipefail

INSTALL_DIR=${RUNTIME:='/opt/spatial'}
TEMP_DIR="$(pwd)/tmp"
mkdir -p "${INSTALL_DIR}"

DOWNLOAD_URL='http://download.osgeo.org/libtiff/tiff-4.0.10.tar.gz'
rm -rf "${TEMP_DIR}/libtiff"
mkdir -p "${TEMP_DIR}/libtiff"
curl "${DOWNLOAD_URL}" | tar -xz --strip-components=1 -C "${TEMP_DIR}/libtiff"

cd "${TEMP_DIR}/libtiff"
./configure \
  --prefix="${INSTALL_DIR}" \
  --enable-static=no

make -j8
make install

# clean up
rm -rf "${TEMP_DIR}/libtiff"
