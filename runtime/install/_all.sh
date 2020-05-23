#!/bin/bash
set -euxo pipefail

# install all dependencies
./sqlite.sh
./zlib.sh
./icu.sh
./libtiff.sh
./proj7.sh
./geos.sh
./rttopo.sh
./libxml2.sh
./spatialite5.sh
./expat.sh
./readosm.sh
./spatialite-tools.sh
