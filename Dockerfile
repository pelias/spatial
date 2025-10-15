FROM pelias/baseimage

# install commands used by bin/download script
RUN apt-get update && \
  apt-get install -y jq lbzip2 pigz zstd && \
  rm -rf /var/lib/apt/lists/*

# working directory
WORKDIR /code

# copy source files
COPY . /code

# install npm dependencies, run tests and prune dev dependencies
RUN npm install && \
  npm run env_check && \
  npm test && \
  npm prune --production

# entrypoint
ENTRYPOINT ["node", "bin/spatial.js"]
