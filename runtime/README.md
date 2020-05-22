# Runtime Environment

This project requires linking several dynamic C/C++ libraries at run-time.

Package managers on various operating systems/platforms provide inconsistent versions of these dependencies, this makes it difficult to install the correct versions in `/usr/local` without breaking other software on the system.

In order to overcome this problem we instead install the dependencies outside of the main operating system dir, instead compiling and installing the dependencies in a custom directory.

By default the runtime directory is configured as `/opt/spatial`, it is strongly recommended you use this location as everything 'just works'.

Note: on many operating systems `/opt` will be owned by root, so if you manually `sudo mkdir -p /opt/spatial` and `sudo chown $USER /opt/spatial` then you can continue the rest of the install without using `sudo`.

The runtime directory may be configured by setting the `RUNTIME` env var at BOTH install time AND at runtime if you can't write to `/opt` for any reason.

## Local Runtime Environment

### Generic installation (works on Mac/Linux)

```bash
export RUNTIME='/opt/spatial'
sudo mkdir -p $RUNTIME
sudo chown $USER $RUNTIME

cd runtime/install
./_all.sh
```

The install will take 5-10 minutes depending on your hardware.
A complete runtime environment consumes about 50Mb of disk space.

```bash
du -sh /opt/spatial
 49M	/opt/spatial
```

## Docker Runtime Environments

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
