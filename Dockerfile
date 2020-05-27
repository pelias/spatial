FROM pelias/spatial:runtime_ubuntu_bionic as runtime

FROM pelias/baseimage

# installation directory
ENV RUNTIME='/opt/spatial'

# copy libs (maintaining symlinks)
COPY --from=runtime ${RUNTIME} ${RUNTIME}

# copy source files
COPY . /code

# we require clang++ for compiling better-sqlite3
RUN apt-get update -y && \
  apt-get install -y clang && \
  rm -rf /var/lib/apt/lists/*

# npm install
WORKDIR /code
RUN npm i --unsafe-perm

# run tests
RUN npm run env_check
RUN npm t

# entrypoint
ENTRYPOINT ["node", "bin/spatial.js"]
