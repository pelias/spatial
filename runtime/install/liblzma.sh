#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf liblzma && mkdir -p liblzma

# download release and decompress it
curl -L 'https://tukaani.org/xz/xz-5.2.5.tar.bz2' \
  | tar -xz --strip-components=1 -C liblzma

# working directory
cd liblzma

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --enable-static=no

# compile and install in runtime directory
make -j8
make install

# clean up
rm -rf /tmp/liblzma
