FROM ubuntu:noble

# apt dependencies
RUN apt-get update -y && \
  apt-get install -y curl && \
  curl -fsSL https://deb.nodesource.com/setup_24.x -o nodesource_setup.sh && \
  bash nodesource_setup.sh && \
  apt-get install -y nodejs libsqlite3-mod-spatialite && \
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
