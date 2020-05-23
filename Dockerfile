FROM pelias/spatial:runtime_alpine_3_10

# install dependencies
RUN apk update && \
  apk add --update --force-overwrite bash nodejs npm curl-dev && \
  rm -rf /var/cache/apk/*

# configure npm
RUN npm set progress=false && npm config set depth

# configure directories
RUN mkdir -p /code /data
WORKDIR /code

# copy source files
COPY . /code

# npm install
RUN apk update && \
  apk add --update --force-overwrite make g++ python && \
  npm i --unsafe-perm && \
  apk del make g++ python && \
  rm -rf /var/cache/apk/*

# run tests
RUN npm run env_check && npm t

# entrypoint
ENTRYPOINT ["node", "bin/spatial.js"]
