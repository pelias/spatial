FROM missinglink/gis:buster as surrogate

# FROM debian:buster

# # === install environment ===

# # COPY --from=surrogate /usr/local/lib/* /usr/local/lib/
# COPY --from=surrogate /usr/local/lib/libspatialite.so.7 /usr/local/lib/libspatialite.so.7
# COPY --from=surrogate /usr/local/lib/librttopo.so.1 /usr/local/lib/librttopo.so.1
# COPY --from=surrogate /usr/local/lib/libfreexl.so.1 /usr/local/lib/libfreexl.so.1
# COPY --from=surrogate /usr/local/lib/libreadosm.so.1 /usr/local/lib/libreadosm.so.1
# COPY --from=surrogate /usr/local/lib/libsqlite3.so.0 /usr/local/lib/libsqlite3.so.0
# COPY --from=surrogate /usr/local/lib/mod_spatialite.so /usr/local/lib/mod_spatialite.so

# # COPY --from=surrogate /lib/x86_64-linux-gnu/* /lib/x86_64-linux-gnu/
# COPY --from=surrogate /lib/x86_64-linux-gnu/libz.so.1 /lib/x86_64-linux-gnu/libz.so.1
# COPY --from=surrogate /lib/x86_64-linux-gnu/libexpat.so.1 /lib/x86_64-linux-gnu/libexpat.so.1
# COPY --from=surrogate /lib/x86_64-linux-gnu/libm.so.6 /lib/x86_64-linux-gnu/libm.so.6
# COPY --from=surrogate /lib/x86_64-linux-gnu/libdl.so.2 /lib/x86_64-linux-gnu/libdl.so.2
# COPY --from=surrogate /lib/x86_64-linux-gnu/libpthread.so.0 /lib/x86_64-linux-gnu/libpthread.so.0
# COPY --from=surrogate /lib/x86_64-linux-gnu/libc.so.6 /lib/x86_64-linux-gnu/libc.so.6
# COPY --from=surrogate /lib/x86_64-linux-gnu/liblzma.so.5 /lib/x86_64-linux-gnu/liblzma.so.5
# COPY --from=surrogate /lib/x86_64-linux-gnu/libgcc_s.so.1 /lib/x86_64-linux-gnu/libgcc_s.so.1

# # COPY --from=surrogate /usr/lib/x86_64-linux-gnu/* /usr/lib/x86_64-linux-gnu/
# COPY --from=surrogate /usr/lib/x86_64-linux-gnu/libxml2.so.2 /usr/lib/x86_64-linux-gnu/libxml2.so.2
# COPY --from=surrogate /usr/lib/x86_64-linux-gnu/libproj.so.13 /usr/lib/x86_64-linux-gnu/libproj.so.13
# COPY --from=surrogate /usr/lib/x86_64-linux-gnu/libgeos_c.so.1 /usr/lib/x86_64-linux-gnu/libgeos_c.so.1
# COPY --from=surrogate /usr/lib/x86_64-linux-gnu/libicui18n.so.63 /usr/lib/x86_64-linux-gnu/libicui18n.so.63
# COPY --from=surrogate /usr/lib/x86_64-linux-gnu/libicuuc.so.63 /usr/lib/x86_64-linux-gnu/libicuuc.so.63
# COPY --from=surrogate /usr/lib/x86_64-linux-gnu/libicudata.so.63 /usr/lib/x86_64-linux-gnu/libicudata.so.63
# COPY --from=surrogate /usr/lib/x86_64-linux-gnu/libgeos-3.7.1.so /usr/lib/x86_64-linux-gnu/libgeos-3.7.1.so
# COPY --from=surrogate /usr/lib/x86_64-linux-gnu/libstdc++.so.6 /usr/lib/x86_64-linux-gnu/libstdc++.so.6

# # install some binaries too
# COPY --from=surrogate /usr/local/bin/spatialite /usr/local/bin/spatialite
# COPY --from=surrogate /usr/local/bin/sqlite3 /usr/local/bin/sqlite3

# # ensure those paths are readable
# ENV LD_LIBRARY_PATH="/usr/lib:/usr/local/lib:/usr/lib/x86_64-linux-gnu:/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH}"

# # test it all works
# RUN spatialite ':memory:' 'SELECT sqlite_version()'
# RUN spatialite ':memory:' 'SELECT spatialite_version()'
# RUN sqlite3 :memory: 'SELECT load_extension("mod_spatialite")'

# === install application ===

USER root

# install node and npm
RUN apt-get update -y && apt-get install -y curl software-properties-common && rm -rf /var/lib/apt/lists/*
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y python build-essential nodejs && rm -rf /var/lib/apt/lists/*

# create working dir
RUN mkdir /code
WORKDIR /code

# configure npm
RUN npm set progress=false && npm config set depth 0

# prebuild amalgamation
COPY amalgamation /code/amalgamation
# RUN npm i -g --unsafe better-sqlite3@latest --sqlite3=$PWD/amalgamation/sqlite-amalgamation-3280000
# RUN curl -O https://www.sqlite.org/2020/sqlite-amalgamation-3310100.zip && unzip sqlite-amalgamation-3310100.zip && rm sqlite-amalgamation-3310100.zip
RUN npm i -g --unsafe better-sqlite3@5.4.3 --sqlite3=/code/amalgamation/sqlite-amalgamation-3310100
# RUN npm i -g --ignore-scripts --unsafe better-sqlite3@6.0.1

# preinstall dependencies
COPY package.json /code
RUN npm i --link
# RUN npm i --ignore-scripts --link
# RUN npm i

# copy source files
COPY . /code
# RUN npm i --link

# ENV SPATIALITE_EXTENSION_PATH=/usr/lib/x86_64-linux-gnu
# ENV SPATIALITE_EXTENSION_INIT=libspatialite.so.7.1.1
# ENV SPATIALITE_EXTENSION_INIT=libspatialite.so.7.1.0

# RUN ln -s /usr/lib/x86_64-linux-gnu/libspatialite.so.7.1.0 /usr/lib/x86_64-linux-gnu/libspatialite
# RUN ln -s /usr/lib/x86_64-linux-gnu/mod_spatialite.so.7.1.0 /usr/lib/x86_64-linux-gnu/mod_spatialite

# RUN ln -s /usr/local/lib/mod_spatialite.so /usr/local/lib/mod_spatialite

# RUN echo
# RUN ls -lah /usr/lib/x86_64-linux-gnu
# RUN ls -lah /usr/local/lib
# RUN ls -lah /usr/local/lib/libspatialite.so
# RUN ldd /usr/local/lib/libspatialite.so
# RUN ls -lah /usr/local/lib/mod_spatialite.so
# RUN ldd /usr/local/lib/mod_spatialite.so

# RUN ldd /usr/local/lib/mod_spatialite.so
# RUN ldd /usr/local/lib/mod_spatialite

# ENV SPATIALITE_EXTENSION_PATH=/usr/local/lib
# ENV SPATIALITE_EXTENSION_PATH=/usr/lib/x86_64-linux-gnu
# ENV SPATIALITE_EXTENSION_INIT=mod_spatialite.so.7.1.0
# ENV SPATIALITE_EXTENSION_INIT=libspatialite.so.7.1.1
# ENV SPATIALITE_EXTENSION_INIT=libspatialite.so.7.1.0

# COPY ./test.js /code/test.js

# RUN cat /code/test.js

RUN echo
RUN sqlite3 --version
RUN sqlite3 :memory: 'SELECT load_extension("mod_spatialite"); SELECT spatialite_version()'
RUN sqlite3 :memory: 'PRAGMA compile_options'
RUN node -e 'console.log(require("better-sqlite3")("/tmp/foo", {memory: true}).prepare("PRAGMA compile_options").all())'
RUN node -e 'console.log(require("better-sqlite3")("/tmp/foo", {memory: true}).prepare("SELECT sqlite_version()").all())'
# RUN node /code/test.js

# # run environment check
RUN npm run env_check

# # run tests
# RUN npm t

# entrypoint
# ENTRYPOINT ["node", "bin/spatial.js"]
