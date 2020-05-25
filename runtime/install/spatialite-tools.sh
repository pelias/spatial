#!/bin/bash
set -euxo pipefail

# import utils script
. ./_utils.sh

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clone latest 'spatialite-tools' from fossil
gaia_clone 'spatialite-tools'
cd 'spatialite-tools'

# build flags (link dependencies)
export CPPFLAGS="-I${RUNTIME}/include"
export LDFLAGS="-L${RUNTIME}/lib"
export LDFLAGS="${LDFLAGS} -Wl,-rpath,${RUNTIME}/lib" # set 'rpath'
export PKG_CONFIG_PATH="${RUNTIME}/lib/pkgconfig"
export LIBS='-ldl ' # note: requires trailing space!

# link spatialite
export LIBSPATIALITE_CFLAGS="-I${RUNTIME}/include"
export LIBSPATIALITE_LIBS='-lspatialite'

# link readosm
export LIBREADOSM_CFLAGS="-I${RUNTIME}/include"
export LIBREADOSM_LIBS="-L${RUNTIME}/lib -lreadosm"

# link rttopo
export RTTOPO_CFLAGS="-I${RUNTIME}/include"
export RTTOPO_LIBS='-lrttopo'

# link libxml2
export LIBXML2_CFLAGS="-I${RUNTIME}/include/libxml2"
export LIBXML2_LIBS="-L${RUNTIME}/lib -lxml2"

# fix for expat install!?
if [ -x "$(command -v gsed)" ]; then
  gsed -i 's:LIBS="-lexpat  $LIBS":LIBS="-L/opt/spatial/lib -lexpat":g' configure
else
  sed -i 's:LIBS="-lexpat  $LIBS":LIBS="-L/opt/spatial/lib -lexpat":g' configure
fi

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --disable-dependency-tracking \
  --enable-rttopo=yes \
  --enable-libxml2=yes \
  --disable-freexl \
  --with-geosconfig="${RUNTIME}/bin/geos-config" \
  --enable-static=no

# compile and install in runtime directory
make -j8
make install-strip

# clean up
rm -rf /tmp/spatialite-tools
