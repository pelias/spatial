#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf lz4 && mkdir -p lz4

# download release and decompress it
curl -L 'https://github.com/lz4/lz4/archive/v1.9.2.tar.gz' \
  | tar -xz --strip-components=1 -C lz4

# working directory
cd lz4

# configure build
# @todo dynamic only?
export PREFIX="${RUNTIME}"

# compile and install in runtime directory
make -j8
make uninstall
make install

# clean up
rm -rf /tmp/lz4
