#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf libxml2 && mkdir -p libxml2

# download release and decompress it
curl -L 'ftp://xmlsoft.org/libxml2/libxml2-2.9.10.tar.gz' \
  | tar -xz --strip-components=1 -C libxml2

# working directory
cd libxml2

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --enable-static=no \
  --without-python

# compile and install in runtime directory
make -j8
make install-strip

# clean up
rm -rf /tmp/libxml2
