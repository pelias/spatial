#!/bin/bash
set -euxo pipefail

# import utils script
. ./_utils.sh

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clone latest 'librasterlite2' from fossil
gaia_clone 'librasterlite2'
cd 'librasterlite2'

# build flags (link dependencies)
export CPPFLAGS="-I${RUNTIME}/include"
export LDFLAGS="-L${RUNTIME}/lib"
export LIBS="-ldl"


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

# link lz4
export LIBLZ4_CFLAGS="-I${RUNTIME}/include"
export LIBLZ4_LIBS="-L${RUNTIME}/lib -llz4"

# link lzstd
export LIBZSTD_CFLAGS="-I${RUNTIME}/include"
export LIBZSTD_LIBS="-L${RUNTIME}/lib -llzstd"

# link openjpeg
export LIBOPENJP2_CFLAGS="-I${RUNTIME}/include"
export LIBOPENJP2_LIBS="-L${RUNTIME}/lib -lopenjp2"

# link libwebp
export LIBWEBP_CFLAGS="-I${RUNTIME}/include"
export LIBWEBP_LIBS="-L${RUNTIME}/lib -lwebp"

# link liblzma
export LIBLZMA_CFLAGS="-I${RUNTIME}/include"
export LIBLZMA_LIBS="-L${RUNTIME}/lib -llzma"

# link librasterlite2
export LIBRASTERLITE2_CFLAGS="-I${RUNTIME}/include"
export LIBRASTERLITE2_LIBS="-L${RUNTIME}/lib -lrasterlite2"

./configure --help

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --disable-dependency-tracking \
  --enable-static=no

# compile and install in runtime directory
make -j8
make install-strip

# clean up
rm -rf /tmp/librasterlite2
