FROM missinglink/spatialite as spatialite

# --- base ---
FROM alpine AS base
COPY --from=spatialite /usr/lib/ /usr/lib
COPY --from=spatialite /usr/bin/ /usr/bin

RUN echo "@edge http://nl.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories
RUN echo "@3.7 http://nl.alpinelinux.org/alpine/v3.7/main" >> /etc/apk/repositories

RUN apk update && \
  apk --no-cache --update upgrade musl && \
  apk add --upgrade apk-tools@edge && \
  apk add --update gcc g++ musl-dev icu-dev@3.7=59.1-r1 icu-libs@3.7=59.1-r1 make python curl unzip jq nodejs nodejs-npm && \
  rm -rf /var/cache/apk/*

RUN spatialite ':memory:' 'SELECT sqlite_version()'
RUN spatialite ':memory:' 'SELECT spatialite_version()'

# create working dir
RUN mkdir /code /data
WORKDIR /code

# --- release ---
FROM base
WORKDIR /code

# configure npm
RUN npm set progress=false && npm config set depth 0

# prebuild amalgamation
COPY amalgamation /code/amalgamation
RUN npm i -g --unsafe better-sqlite3@latest --sqlite3=$PWD/amalgamation/sqlite-amalgamation-3280000

# preinstall dependencies
COPY package.json /code
RUN npm i --link

# copy source files
COPY . /code
RUN npm i --link

# run tests
RUN bin/test
