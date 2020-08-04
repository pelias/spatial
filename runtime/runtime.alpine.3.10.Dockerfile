FROM alpine:3.10 as build

# apk dependencies
RUN echo "@edge http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories
RUN apk update && \
  apk --no-cache --update upgrade musl && \
  apk add --upgrade --force-overwrite apk-tools@edge && \
  apk add --update --force-overwrite autoconf automake gcc g++ libtool make musl-dev@edge && \
  apk add --update --force-overwrite curl-dev && \
  apk add --update --force-overwrite bash curl file unzip && \
  apk add --update --force-overwrite fossil git && \
  rm -rf /var/cache/apk/*

# installation directory
ENV RUNTIME='/opt/spatial'

# setup working directory
RUN mkdir -p /code/runtime/install
WORKDIR /code/runtime/install

# copy build utils
COPY runtime/install/_utils.sh /code/runtime/install/

# install icu
COPY runtime/install/icu.sh /code/runtime/install/
RUN ./icu.sh

# install sqlite3
COPY runtime/install/sqlite.sh /code/runtime/install/
RUN ./sqlite.sh

# install zlib
COPY runtime/install/zlib.sh /code/runtime/install/
RUN ./zlib.sh

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

# install libxml2
COPY runtime/install/libxml2.sh /code/runtime/install/
RUN ./libxml2.sh

# install spatialite5
COPY runtime/install/spatialite5.sh /code/runtime/install/
RUN ./spatialite5.sh

# install expat
COPY runtime/install/expat.sh /code/runtime/install/
RUN ./expat.sh

# install readosm
COPY runtime/install/readosm.sh /code/runtime/install/
RUN ./readosm.sh

# install spatialite-tools
COPY runtime/install/spatialite-tools.sh /code/runtime/install/
RUN ./spatialite-tools.sh

# -----------------------------------------------------------------------
FROM alpine:3.10

# installation directory
ENV RUNTIME='/opt/spatial'

# copy libs (maintaining symlinks)
COPY --from=build ${RUNTIME} ${RUNTIME}

# configure environment variables
ENV PATH="${RUNTIME}/bin:${PATH}"
