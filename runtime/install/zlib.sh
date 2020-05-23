#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf zlib && mkdir -p zlib

# download release and decompress it
curl -L 'http://downloads.sourceforge.net/project/libpng/zlib/1.2.11/zlib-1.2.11.tar.gz' \
  | tar -xz --strip-components=1 -C zlib

# working directory
cd zlib

# configure build
./configure --prefix="${RUNTIME}"

# compile and install in runtime directory
make -j8
make install

# clean up
rm -rf /tmp/zlib
