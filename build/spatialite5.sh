#!/bin/bash
mkdir -p tmp
cd tmp

# loocation of dependencies
# note: if you are having trouble, check these first!
SQLITE3='/usr/local/opt/sqlite'
PROJ6='/usr/local/Cellar/proj/6.1.0'
LIBXML2='/usr/local/Cellar/libxml2/2.9.9_2'

# download a stable release
function download(){
  HOST='http://www.gaia-gis.it/gaia-sins/libspatialite-sources';
  RELEASE="$1";
  [[ -f "${RELEASE}.tar.gz" ]] || curl -LO "${HOST}/${RELEASE}.tar.gz"
  [[ -d "${RELEASE}" ]] || tar xvzf "${RELEASE}.tar.gz"
}

# clone a fossil source
function clone(){
  REPO="$1";
  rm -rf $REPO $REPO.fossil*;
  fossil clone https://www.gaia-gis.it/fossil/$REPO $REPO.fossil;
  mkdir -p $REPO;
  cd $REPO;
  fossil open ../$REPO.fossil;
  cd -;
}

function checkSqliteCompileOptions(){
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
make clean

# build flags
export CPPFLAGS=""
export LDFLAGS=""

# link sqlite
export CPPFLAGS="${CPPFLAGS} -I${SQLITE3}/include"
export LDFLAGS="${LDFLAGS} -L${SQLITE3}/lib"

# link proj
export CPPFLAGS="${CPPFLAGS} -DACCEPT_USE_OF_DEPRECATED_PROJ_API_H" # required flag to use proj6
export CPPFLAGS="${CPPFLAGS} -I${PROJ6}/include"
export LDFLAGS="-L${PROJ6}/lib"

# link libxml2
export CPPFLAGS="${CPPFLAGS} -I${LIBXML2}/include/libxml2"
export LDFLAGS="${LDFLAGS} -L${LIBXML2}/lib"

# # link rttopo
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

# generate additional symlink for MacOS
# this allows sqlite to find the extension using: load_extension('mod_spatialite')
if [[ "$OSTYPE" == "darwin"* ]]; then
  OSX_LIB_DIR='/usr/local/lib'
  if [[ -f "${OSX_LIB_DIR}/mod_spatialite.7.so" ]]; then
    if [[ ! -e "${OSX_LIB_DIR}/mod_spatialite.dylib" ]]; then
      ln -s "${OSX_LIB_DIR}/mod_spatialite.7.so" "${OSX_LIB_DIR}/mod_spatialite.dylib";
    fi
  fi
fi

"${SQLITE3}/bin/sqlite3" :memory: <<SQL
  SELECT 'sqlite_version', sqlite_version();

  SELECT load_extension('./src/.libs/mod_spatialite.so');
  SELECT 'spatialite_version', spatialite_version();

  SELECT 'rttopo_version', rttopo_version();
SQL