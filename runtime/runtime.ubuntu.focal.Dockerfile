FROM ubuntu:focal
ENV DEBIAN_FRONTEND=noninteractive

# apt dependencies
RUN apt-get update -y && \
  apt-get -y install curl libcurl4-gnutls-dev build-essential autoconf libtool unzip fossil git-core zlib1g-dev && \
  rm -rf /var/lib/apt/lists/*

# installation directory
ENV RUNTIME='/opt/spatial'

# setup working directory
RUN mkdir -p /code/runtime/install
WORKDIR /code/runtime/install

# install sqlite3
COPY runtime/install/sqlite.sh /code/runtime/install/
RUN ./sqlite.sh

# install libtiff
COPY runtime/install/libtiff.sh /code/runtime/install/
RUN ./libtiff.sh

# install proj7
COPY runtime/install/proj7.sh /code/runtime/install/
RUN ./proj7.sh

# install geos
COPY runtime/install/geos.sh /code/runtime/install/
RUN ./geos.sh

# install rttopo
COPY runtime/install/rttopo.sh /code/runtime/install/
RUN ./rttopo.sh

# install spatialite5
COPY runtime/install/spatialite5.sh /code/runtime/install/
RUN ./spatialite5.sh

# configure environment variables
ENV PATH="${RUNTIME}/bin:${PATH}"
ENV LD_LIBRARY_PATH="${RUNTIME}/lib:${LD_LIBRARY_PATH}"
ENV PROJ_LIB="${RUNTIME}/data"
