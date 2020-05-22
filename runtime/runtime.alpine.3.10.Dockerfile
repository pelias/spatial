FROM alpine:3.10

# apk dependencies
RUN echo "@edge http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories
RUN apk update && \
  apk --no-cache --update upgrade musl && \
  apk add --upgrade --force-overwrite apk-tools@edge && \
  apk add --update --force-overwrite gcc g++ musl-dev icu-dev icu-libs make python curl unzip jq nodejs npm bash fossil git zlib-dev autoconf automake libtool file curl-dev && \
  rm -rf /var/cache/apk/*

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
