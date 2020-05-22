#!/bin/bash
set -euxo pipefail

INSTALL_DIR=${RUNTIME:='/opt/spatial'}
TEMP_DIR="$(pwd)/tmp"
mkdir -p "${INSTALL_DIR}"

REPO='https://git.osgeo.org/gitea/rttopo/librttopo.git'
BRANCH='master'
cd "${TEMP_DIR}"

rm -rf "${TEMP_DIR}/librttopo"
git clone "${REPO}"

cd "${TEMP_DIR}/librttopo"
git checkout "${BRANCH}"
git pull origin "${BRANCH}"

# link geos
export CPPFLAGS="-I${INSTALL_DIR}/include"
export LDFLAGS="-L${INSTALL_DIR}/lib"

./autogen.sh
./configure \
  --prefix="${INSTALL_DIR}" \
  --with-geosconfig="${INSTALL_DIR}/bin/geos-config" \
  --enable-static=no

make -j8
make install

# clean up
rm -rf "${TEMP_DIR}/librttopo"
