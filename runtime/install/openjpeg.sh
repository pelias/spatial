#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf openjpeg && mkdir -p openjpeg

# download release and decompress it
curl -L 'https://github.com/uclouvain/openjpeg/archive/v2.3.1.tar.gz' \
  | tar -xz --strip-components=1 -C openjpeg

# working directory
cd openjpeg

# configure build
mkdir -p build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX="${RUNTIME}"

# compile and install in runtime directory
make -j8
make install

# clean up
rm -rf /tmp/openjpeg
