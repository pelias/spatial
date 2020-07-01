#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf charls && mkdir -p charls

# download release and decompress it
curl -L 'https://github.com/team-charls/charls/archive/2.1.0.tar.gz' \
  | tar -xz --strip-components=1 -C charls

# working directory
cd charls

# configure build
mkdir -p release && cd release
cmake -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=On -DCMAKE_INSTALL_PREFIX="${RUNTIME}" ..

# compile and install in runtime directory
make -j8
make install

# clean up
rm -rf /tmp/charls
