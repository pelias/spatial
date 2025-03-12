#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf libwebp && mkdir -p libwebp

# download release and decompress it
curl -L 'https://github.com/webmproject/libwebp/archive/v1.1.0.tar.gz' \
  | tar -xz --strip-components=1 -C libwebp

# working directory
cd libwebp

# configure build
./autogen.sh
./configure \
  --prefix="${RUNTIME}"

# compile and install in runtime directory
make -j8
make install

# clean up
rm -rf /tmp/libwebp
