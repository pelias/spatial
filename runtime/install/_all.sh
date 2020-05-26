#!/bin/bash
set -euxo pipefail

# install all dependencies
./icu.sh
./sqlite_new.sh
./zlib.sh
./libtiff.sh
./proj7.sh
./geos.sh
./rttopo.sh
./libxml2.sh
./spatialite5.sh
./expat.sh
./readosm.sh
./spatialite-tools.sh
