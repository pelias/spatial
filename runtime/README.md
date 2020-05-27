# Runtime Environment

This project requires linking several dynamic C/C++ libraries at run-time.

Package managers on various operating systems/platforms provide inconsistent versions of these dependencies, this makes it difficult to install the correct versions in `/usr/local` without breaking other software on the system.

In order to overcome this problem we install the dependencies outside of the main operating system dir, instead compiling and installing the dependencies into a custom directory.

By default the runtime directory is configured as `/opt/spatial`, it is strongly recommended you use this location as everything 'just works'.

Note: on many operating systems `/opt` will be owned by root, so if you manually `sudo mkdir -p /opt/spatial` and `sudo chown $USER /opt/spatial` then you can continue the rest of the install without using `sudo`.

The runtime directory may be configured by setting the `RUNTIME` env var at install time if you can't write to `/opt` for any reason.

## Local Runtime Environment

### Generic installation (works on Mac/Linux)

You'll need to have the normal C/C++ build tools installed.

Note: one dependency is not currently bundled.

You'll need to install `libcurl`, you can usually find it in your package manager called something like `curl-dev` or `libcurl4-gnutls-dev`.

```bash
export RUNTIME='/opt/spatial'
sudo mkdir -p $RUNTIME
sudo chown $USER $RUNTIME

cd runtime/install
./_all.sh
```

The install will take 5-10 minutes depending on your hardware.
A complete runtime environment consumes about 90Mb of disk space.

```bash
du -sh /opt/spatial
 91M	/opt/spatial
```

### Install Node modules

You'll need to have the `clang++` command installed.

```bash
npm install
```

### Testing the installation

```bash
npm run env_check
```

## Docker Runtime Environments

### Ubuntu Bionic (18.04) `pelias/spatial:runtime_ubuntu_bionic`

```bash
docker build \
 -t pelias/spatial:runtime_ubuntu_bionic \
 -f runtime/runtime.ubuntu.bionic.Dockerfile \
 .
```

### Alpine (3.10) `pelias/spatial:runtime_alpine_3_10`

```bash
docker build \
 -t pelias/spatial:runtime_alpine_3_10 \
 -f runtime/runtime.alpine.3.10.Dockerfile \
 .
```

### Ubuntu Focal (20.04) `pelias/spatial:runtime_ubuntu_focal`

```bash
docker build \
 -t pelias/spatial:runtime_ubuntu_focal \
 -f runtime/runtime.ubuntu.focal.Dockerfile \
 .
```

### Debian Buster (10.04) `pelias/spatial:runtime_debian_buster`

```bash
docker build \
 -t pelias/spatial:runtime_debian_buster \
 -f runtime/runtime.debian.buster.Dockerfile \
 .
```
