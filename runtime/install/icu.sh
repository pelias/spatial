#!/bin/bash
set -euxo pipefail

# configure runtime environment
RUNTIME=${RUNTIME:='/opt/spatial'}
mkdir -p "${RUNTIME}"

# working directory
cd /tmp

# clean up
rm -rf icu && mkdir -p icu

# download release and decompress it
curl -L 'http://github.com/unicode-org/icu/releases/download/release-67-1/icu4c-67_1-src.tgz' \
  | tar -xz --strip-components=1 -C icu

# working directory
cd icu/source

# set 'rpath'
export LDFLAGS="-Wl,-rpath,${RUNTIME}/lib"

# configure build
./configure \
  --prefix="${RUNTIME}" \
  --disable-debug \
  --disable-samples \
  --disable-tests \
  --disable-static

# compile and install in runtime directory
make -j8
make install

## tell DYLIB files on Mac to use rpath
if [[ "$OSTYPE" == "darwin"* ]]; then
  install_name_tool -id '@rpath/libicui18n.67.dylib' "${RUNTIME}/lib/libicui18n.67.dylib"
  install_name_tool -change 'libicuuc.67.dylib' '@rpath/libicuuc.67.dylib' "${RUNTIME}/lib/libicui18n.67.dylib"
  install_name_tool -change 'libicudata.67.dylib' '@rpath/libicudata.67.dylib' "${RUNTIME}/lib/libicui18n.67.dylib"

  install_name_tool -id '@rpath/libicuuc.67.dylib' "${RUNTIME}/lib/libicuuc.67.dylib"
  install_name_tool -change 'libicudata.67.dylib' '@rpath/libicudata.67.dylib' "${RUNTIME}/lib/libicuuc.67.dylib"

  install_name_tool -id '@rpath/libicudata.67.dylib' "${RUNTIME}/lib/libicudata.67.dylib"
fi

# clean up
rm -rf /tmp/icu
