#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf geos && mkdir -p geos

# download release and decompress it
curl -L 'http://download.osgeo.org/geos/geos-3.13.1.tar.bz2' \
  | tar -xj --strip-components=1 -C geos

# working directory
mkdir geos/build
cd geos/build

# configure build
cmake \
  -DCMAKE_INSTALL_PREFIX="${RUNTIME}" \
  -DBUILD_BENCHMARKS=OFF \
  -DBUILD_TESTING=OFF \
  ..

# compile and install in runtime directory
make -j4
make install

# clean up
rm -rf /tmp/geos
