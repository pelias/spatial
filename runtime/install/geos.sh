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
curl -L 'http://download.osgeo.org/geos/geos-3.8.1.tar.bz2' \
  | tar -xj --strip-components=1 -C geos

# working directory
cd geos

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --enable-static=no

# compile and install in runtime directory
make -j4
make install-strip

# clean up
rm -rf /tmp/geos
