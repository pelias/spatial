#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf zstd && mkdir -p zstd

# download release and decompress it
curl -L 'https://github.com/facebook/zstd/releases/download/v1.4.5/zstd-1.4.5.tar.gz' \
  | tar -xz --strip-components=1 -C zstd

# working directory
cd zstd

# configure build
# @todo dynamic only?
export PREFIX="${RUNTIME}"

# compile and install in runtime directory
make -j8
make install

# clean up
rm -rf /tmp/zstd
