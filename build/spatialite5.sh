#!/bin/bash
HOST='http://www.gaia-gis.it/gaia-sins/libspatialite-sources'
RELEASE='libspatialite-5.0.0-beta0'

mkdir -p tmp
cd tmp

[[ -f "${RELEASE}.tar.gz" ]] || curl -LO "${HOST}/${RELEASE}.tar.gz"
[[ -d "${RELEASE}" ]] || tar xvzf "${RELEASE}.tar.gz"

cd "${RELEASE}"
make clean

# build flags
export CPPFLAGS=""
export LDFLAGS=""

# location of sqlite
SQLITE3='/usr/local/opt/sqlite'
export CPPFLAGS="${CPPFLAGS} -I${SQLITE3}/include"
export LDFLAGS="${LDFLAGS} -L${SQLITE3}/lib"

# check sqlite was compiled with 'ENABLE_RTREE'
"${SQLITE3}/bin/sqlite3" :memory: 'PRAGMA compile_options' | grep -q ENABLE_RTREE
if [[ $? != 0 ]]; then
  2>&1 echo 'sqlite3 was not compiled with the ENABLE_RTREE extension'
  exit 1
fi

# check sqlite was compiled with 'ENABLE_COLUMN_METADATA'
"${SQLITE3}/bin/sqlite3" :memory: 'PRAGMA compile_options' | grep -q ENABLE_COLUMN_METADATA
if [[ $? != 0 ]]; then
  2>&1 echo 'sqlite3 was not compiled with the ENABLE_COLUMN_METADATA extension'
  exit 1
fi

# location of proj
PROJ6='/usr/local/Cellar/proj/6.1.0'
export CPPFLAGS="${CPPFLAGS} -DACCEPT_USE_OF_DEPRECATED_PROJ_API_H" # required flag to use proj6
export CPPFLAGS="${CPPFLAGS} -I${PROJ6}/include"
export LDFLAGS="-L${PROJ6}/lib"

# location of libxml2
LIBXML2='/usr/local/Cellar/libxml2/2.9.9_2'
export CPPFLAGS="${CPPFLAGS} -I${LIBXML2}/include/libxml2"
export LDFLAGS="${LDFLAGS} -L${LIBXML2}/lib"

# # location of rttopo
# RTTOPO="$(pwd)/librttopo"
# export CPPFLAGS="${CPPFLAGS} -DGEOS_USE_ONLY_R_API" # required flag to use rttopo?
# export CPPFLAGS="${CPPFLAGS} -I${RTTOPO}/headers"
# export LDFLAGS="${LDFLAGS} -L${RTTOPO}/src"

./configure \
  --disable-dependency-tracking \
  --enable-rttopo=yes \
  --enable-proj=yes \
  --enable-geos=yes \
  --enable-gcp=yes \
  --enable-libxml2=yes

make -j8
make install

"${SQLITE3}/bin/sqlite3" :memory: <<SQL
  SELECT 'sqlite_version', sqlite_version();

  SELECT load_extension('./src/.libs/mod_spatialite.so');
  SELECT 'spatialite_version', spatialite_version();

  SELECT 'rttopo_version', rttopo_version();
SQL