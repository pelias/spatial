#!/bin/bash
REPO='https://git.osgeo.org/gitea/rttopo/librttopo.git'
BRANCH='master'

mkdir -p tmp
cd tmp

[[ -d "${RELEASE}" ]] || git clone "${REPO}"

cd 'librttopo'
git checkout "${BRANCH}"

make clean
./autogen.sh
./configure
make -j8
make check
make install

# /usr/local/include/