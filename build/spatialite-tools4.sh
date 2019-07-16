#!/bin/bash
HOST='http://www.gaia-gis.it/gaia-sins'
RELEASE='spatialite-tools-4.4.0-RC0'

mkdir -p tmp
cd tmp

[[ -f "${RELEASE}.tar.gz" ]] || curl -LO "${HOST}/${RELEASE}.tar.gz"
[[ -d "${RELEASE}" ]] || tar xvzf "${RELEASE}.tar.gz"

cd "${RELEASE}"
make clean

# build flags
export CPPFLAGS=""
export LDFLAGS=""

# location of spatialite
export LDFLAGS="${LDFLAGS} -L/usr/local/lib"

# location of sqlite
SQLITE3='/usr/local/opt/sqlite'
export CPPFLAGS="${CPPFLAGS} -I${SQLITE3}/include"
export LDFLAGS="${LDFLAGS} -L${SQLITE3}/lib"

# location of spatialite
SPATIALITE="$(pwd)/../libspatialite-5.0.0-beta0"
export CPPFLAGS="${CPPFLAGS} -I${SPATIALITE}/src/headers"
export LDFLAGS="${LDFLAGS} -L${SPATIALITE}/src"

# # location of proj
# PROJ6='/usr/local/Cellar/proj/6.1.0'
# export CPPFLAGS="${CPPFLAGS} -DACCEPT_USE_OF_DEPRECATED_PROJ_API_H" # required flag to use proj6
# export CPPFLAGS="${CPPFLAGS} -I${PROJ6}/include"
# export LDFLAGS="-L${PROJ6}/lib"

# location of libxml2
LIBXML2='/usr/local/Cellar/libxml2/2.9.9_2'
export CPPFLAGS="${CPPFLAGS} -I${LIBXML2}/include/libxml2"
export LDFLAGS="${LDFLAGS} -L${LIBXML2}/lib"

./configure --disable-dependency-tracking
make -j8

# export LD_LIBRARY_PATH="/usr/local/lib"
./spatialite -silent :memory: <<SQL
  SELECT 'sqlite_version', sqlite_version();
  SELECT 'spatialite_version', spatialite_version();
SQL