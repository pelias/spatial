#!/bin/bash
set -euxo pipefail

# install all dependencies
./sqlite.sh
./libtiff.sh
./proj7.sh
./geos.sh
./rttopo.sh
./spatialite5.sh
