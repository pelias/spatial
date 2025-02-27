#!/bin/bash
set -euxo pipefail

# import utils script
. ./_utils.sh

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clone latest 'readosm' from fossil
gaia_clone 'readosm'
cd 'readosm'

# build flags (link dependencies)
export CPPFLAGS="-I${RUNTIME}/include"
export LDFLAGS="-L${RUNTIME}/lib"
export LIBS="-ldl"

# generate config.guess
autoreconf -fi

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --disable-dependency-tracking \
  --enable-static=no

# compile and install in runtime directory
make -j4
make install-strip

# clean up
rm -rf /tmp/readosm
