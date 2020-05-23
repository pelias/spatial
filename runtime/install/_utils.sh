#!/bin/bash
set -euxo pipefail

# download a stable release from gaia-gis
function gaia_download(){
  HOST='http://www.gaia-gis.it/gaia-sins/libspatialite-sources'
  RELEASE="$1"
  [[ -f "${RELEASE}.tar.gz" ]] || curl -LO "${HOST}/${RELEASE}.tar.gz"
  [[ -d "${RELEASE}" ]] || tar xvzf "${RELEASE}.tar.gz"
}

# clone a fossil source from gaia-gis
function gaia_clone(){
  REPO="$1"
  rm -rf "${REPO}" "${REPO}.fossil"*
  USER='me' fossil clone https://www.gaia-gis.it/fossil/$REPO $REPO.fossil
  ls -lah
  mkdir -p "${REPO}"
  cd "${REPO}"
  fossil open "../${REPO}.fossil"
  cd -
  rm -rf "${REPO}.fossil"*
}

function checkSqliteCompileOptions(){
  # check sqlite was compiled with 'ENABLE_RTREE'
  "${RUNTIME}/bin/sqlite3" :memory: 'PRAGMA compile_options' | grep -q ENABLE_RTREE
  if [[ $? != 0 ]]; then
    2>&1 echo 'sqlite3 was not compiled with the ENABLE_RTREE extension'
    exit 1
  fi

  # check sqlite was compiled with 'ENABLE_COLUMN_METADATA'
  "${RUNTIME}/bin/sqlite3" :memory: 'PRAGMA compile_options' | grep -q ENABLE_COLUMN_METADATA
  if [[ $? != 0 ]]; then
    2>&1 echo 'sqlite3 was not compiled with the ENABLE_COLUMN_METADATA extension'
    exit 1
  fi
}
