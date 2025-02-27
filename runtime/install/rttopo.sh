#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf librttopo && mkdir -p librttopo

# clone repo
REPO='https://git.osgeo.org/gitea/rttopo/librttopo.git'
BRANCH='master'
git clone "${REPO}"

# working directory
cd librttopo

# checkout
git checkout "${BRANCH}"

# build flags (link dependencies)
export CPPFLAGS="-I${RUNTIME}/include"
export LDFLAGS="-L${RUNTIME}/lib"

# configure build
./autogen.sh
./configure \
  --prefix="${RUNTIME}" \
  --with-geosconfig="${RUNTIME}/bin/geos-config" \
  --enable-static=no

# compile and install in runtime directory
make -j4
make install-strip

# clean up
rm -rf /tmp/librttopo
