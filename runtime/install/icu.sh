#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf icu && mkdir -p icu

# download release and decompress it
curl -L 'http://github.com/unicode-org/icu/releases/download/release-67-1/icu4c-67_1-src.tgz' \
  | tar -xz --strip-components=1 -C icu

# working directory
cd icu/source

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --enable-rpath \
  --disable-debug \
  --disable-samples \
  --disable-tests \
  --disable-static

# compile and install in runtime directory
make -j8
make install

# clean up
rm -rf /tmp/icu
