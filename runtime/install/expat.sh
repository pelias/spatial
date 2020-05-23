#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf expat && mkdir -p expat

# download release and decompress it
curl -L 'https://github.com/libexpat/libexpat/releases/download/R_2_2_9/expat-2.2.9.tar.gz' \
  | tar -xz --strip-components=1 -C expat

# working directory
cd expat

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --enable-static=no

# compile and install in runtime directory
make -j8
make install-strip

# clean up
rm -rf /tmp/expat
