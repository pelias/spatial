FROM ubuntu:noble

# apt dependencies
RUN apt-get update -y && \
  apt-get install -y nodejs npm libsqlite3-mod-spatialite && \
  rm -rf /var/lib/apt/lists/*

# working directory
WORKDIR /code

# copy source files
COPY . /code

# install npm dependencies
RUN npm i

# run tests
RUN npm t

# entrypoint
ENTRYPOINT ["node", "bin/spatial.js"]
