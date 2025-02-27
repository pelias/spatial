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

# fix for expat install!?
if [ -x "$(command -v gsed)" ]; then
  gsed -i 's:LIBS="-lexpat  $LIBS":LIBS="-L/opt/spatial/lib -lexpat":g' configure
else
  sed -i 's:LIBS="-lexpat  $LIBS":LIBS="-L/opt/spatial/lib -lexpat":g' configure
fi

# generate config.guess
autoreconf -fi

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --disable-dependency-tracking \
  --disable-readosm \
  --enable-static=no

# compile and install in runtime directory
make -j4
make install-strip

## test binary correctly linked in empty env
env -i "${RUNTIME}/bin/spatialite" :memory: 'SELECT spatialite_version()'

# clean up
rm -rf /tmp/spatialite-tools
