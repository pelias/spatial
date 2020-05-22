#!/bin/bash
set -euxo pipefail

INSTALL_DIR=${RUNTIME:='/opt/spatial'}
TEMP_DIR="$(pwd)/tmp"
mkdir -p "${INSTALL_DIR}"
cd "${TEMP_DIR}"

# download a stable release
# function download(){
#   HOST='http://www.gaia-gis.it/gaia-sins/libspatialite-sources';
#   RELEASE="$1";
#   [[ -f "${RELEASE}.tar.gz" ]] || curl -LO "${HOST}/${RELEASE}.tar.gz"
#   [[ -d "${RELEASE}" ]] || tar xvzf "${RELEASE}.tar.gz"
# }

# clone a fossil source
function clone(){
  REPO="$1";
  rm -rf $REPO $REPO.fossil*;
  USER='me' fossil clone https://www.gaia-gis.it/fossil/$REPO $REPO.fossil;
  ls -lah
  mkdir -p $REPO;
  cd $REPO;
  fossil open ../$REPO.fossil;
  cd -;
}

function checkSqliteCompileOptions(){
  # check sqlite was compiled with 'ENABLE_RTREE'
  "${INSTALL_DIR}/bin/sqlite3" :memory: 'PRAGMA compile_options' | grep -q ENABLE_RTREE
  if [[ $? != 0 ]]; then
    2>&1 echo 'sqlite3 was not compiled with the ENABLE_RTREE extension'
    exit 1
  fi

  # check sqlite was compiled with 'ENABLE_COLUMN_METADATA'
  "${INSTALL_DIR}/bin/sqlite3" :memory: 'PRAGMA compile_options' | grep -q ENABLE_COLUMN_METADATA
  if [[ $? != 0 ]]; then
    2>&1 echo 'sqlite3 was not compiled with the ENABLE_COLUMN_METADATA extension'
    exit 1
  fi
}

# ensure sqlite was compiled using the required compiler options
checkSqliteCompileOptions;

# clone cutting-edge from fossil
clone 'libspatialite'
RELEASE='libspatialite'

# download a stable release
# download 'libspatialite-5.0.0-beta0'
# RELEASE='libspatialite-5.0.0-beta0'

cd "${RELEASE}"

# build flags (link dependencies)
export CPPFLAGS="-I${INSTALL_DIR}/include"
export LDFLAGS="-L${INSTALL_DIR}/lib"
export LIBS="-ldl"

# required flag to use proj7?
export CPPFLAGS="${CPPFLAGS} -DACCEPT_USE_OF_DEPRECATED_PROJ_API_H"

./configure \
  --prefix="${INSTALL_DIR}" \
  --disable-dependency-tracking \
  --enable-rttopo=yes \
  --enable-proj=yes \
  --enable-geos=yes \
  --enable-gcp=yes \
  --enable-libxml2=no \
  --disable-freexl \
  --with-geosconfig="${INSTALL_DIR}/bin/geos-config" \
  --enable-static=no

make -j8
make install-strip

# # generate additional symlink for MacOS
# # this allows sqlite to find the extension using: load_extension('mod_spatialite')
# if [[ "$OSTYPE" == "darwin"* ]]; then
#   OSX_LIB_DIR='/usr/local/lib'
#   if [[ -f "${OSX_LIB_DIR}/mod_spatialite.7.so" ]]; then
#     if [[ ! -e "${OSX_LIB_DIR}/mod_spatialite.dylib" ]]; then
#       ln -s "${OSX_LIB_DIR}/mod_spatialite.7.so" "${OSX_LIB_DIR}/mod_spatialite.dylib";
#     fi
#   fi
# fi

# apt-get update
# apt-get install libcurl4-gnutls-dev

# export INSTALL_DIR=/attach/build/custom
# export PATH="${INSTALL_DIR}/sqlite3/:${PATH}"
# export LD_LIBRARY_PATH="${INSTALL_DIR}/sqlite3/:${LD_LIBRARY_PATH}"

# sqlite3 :memory: <"${INSTALL_DIR}/sqlite_version.sql"

# clean up
rm -rf "${TEMP_DIR}/${RELEASE}"
rm -f "${TEMP_DIR}/${RELEASE}.fossil"
