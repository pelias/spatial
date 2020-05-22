FROM pelias/spatial:runtime_alpine_3_10
RUN mkdir -p /code /data
WORKDIR /code

# configure npm
RUN npm set progress=false && npm config set depth

# copy source files
COPY . /code
RUN npm i --unsafe-perm

# run tests
RUN npm run env_check
RUN npm t

# entrypoint
ENTRYPOINT ["node", "bin/spatial.js"]
