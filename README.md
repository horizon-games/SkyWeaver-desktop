SkyWeaver Desktop
=================

## Install or Build your own

**To install a pre-built image, see:** https://github.com/horizon-games/SkyWeaver-desktop/releases

**To build your own:**
1. Clone this repo
2. `yarn install`
3. `yarn dist`
4. Find the distribution for your os in dist/


## NixOS devs

For nixos, you must use the shell.nix which is a mini x11 environment so that
electron installs and is able to link without needing patchelf.

Simply run, `nix-shell`, then inside, `yarn dev`
