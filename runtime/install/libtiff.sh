#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf libtiff && mkdir -p libtiff

# download release and decompress it
curl -L 'http://download.osgeo.org/libtiff/tiff-4.0.10.tar.gz' \
  | tar -xz --strip-components=1 -C libtiff

# working directory
cd libtiff

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --enable-static=no

# compile and install in runtime directory
make -j4
make install-strip

# clean up
rm -rf /tmp/libtiff
