# --- Multi-stage Docker build ---
# 1. Build runtime environment (see runtime/README.md)
# 2. Compile better-sqlite3 module
# 3. Run unit tests to confirm everything is ok
# 4. Produce a minimally sized image for distribution

# 1. ------------------------------------------------
FROM pelias/spatial:runtime_ubuntu_bionic as runtime

# 2. ------------------------------------------------
FROM pelias/baseimage as better_sqlite3

# we require clang++ for compiling better-sqlite3
# this adds ~400MB to the image, so we build in a
# separate image and only copy the files we need.
RUN apt-get update -y
RUN apt-get install -y clang python3 make

# copy runtime
COPY --from=runtime /opt/spatial /opt/spatial

# copy better-sqlite install script
COPY bin/compile_better_sqlite3 /code/bin/

# install better-sqlite3
WORKDIR /code
RUN bin/compile_better_sqlite3

# 3. ------------------------------------------------
FROM pelias/baseimage as testing

# copy runtime
COPY --from=runtime /opt/spatial /opt/spatial

# copy pre-installed better_sqlite3 from image above
COPY --from=better_sqlite3 /code/node_modules/better-sqlite3 /code/node_modules/better-sqlite3

# working directory
WORKDIR /code

# install npm dependencies
COPY package.json /code/
RUN npm i --ignore-scripts

# copy source files
COPY . /code

# run tests
RUN npm run env_check && npm t

# 4. ------------------------------------------------
FROM pelias/baseimage

# copy runtime
COPY --from=runtime /opt/spatial /opt/spatial

# copy pre-installed better_sqlite3 from image above
COPY --from=better_sqlite3 /code/node_modules/better-sqlite3 /code/node_modules/better-sqlite3

# working directory
WORKDIR /code

# install npm dependencies (production mode)
COPY package.json /code/
RUN npm i --production --ignore-scripts

# copy source files
COPY . /code

# entrypoint
ENTRYPOINT ["node", "bin/spatial.js"]
