FROM pelias/baseimage

# working directory
WORKDIR /code

# copy source files
COPY . /code

# install npm dependencies, run tests and prune dev dependencies
RUN npm install && \
  npm run env_check && \
  npm test && \
  npm prune --production && \
  rm -rf ~/.npm /tmp/*

# entrypoint
ENTRYPOINT ["node", "bin/spatial.js"]
