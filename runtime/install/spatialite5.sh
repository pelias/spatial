#!/bin/bash
set -euxo pipefail

# import utils script
. ./_utils.sh

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# ensure sqlite was compiled using the required compiler options
checkSqliteCompileOptions

# working directory
cd /tmp

# clone latest 'libspatialite' from fossil
gaia_clone 'libspatialite'
cd 'libspatialite'

# build flags (link dependencies)
export CPPFLAGS="-I${RUNTIME}/include"
export LDFLAGS="-L${RUNTIME}/lib"
export LDFLAGS="${LDFLAGS} -Wl,-rpath,${RUNTIME}/lib" # set 'rpath'
export LIBS='-ldl'

# link libxml2
export LIBXML2_CFLAGS="-I${RUNTIME}/include/libxml2"
export LIBXML2_LIBS="-L${RUNTIME}/lib -lxml2"

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --disable-dependency-tracking \
  --enable-rttopo=yes \
  --enable-proj=yes \
  --enable-geos=yes \
  --enable-gcp=yes \
  --enable-libxml2=yes \
  --disable-freexl \
  --with-geosconfig="${RUNTIME}/bin/geos-config" \
  --enable-static=no

# compile and install in runtime directory
make -j8
make install-strip

## symlink 'mod_spatialite.dylib' on Mac
if [[ "$OSTYPE" == "darwin"* ]]; then
  ln -sf "${RUNTIME}/lib/mod_spatialite.so" "${RUNTIME}/lib/mod_spatialite.dylib"
fi

# clean up
rm -rf /tmp/libspatialite
