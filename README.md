SkyWeaver Desktop
=================

## Install or Build your own

**To install a pre-built image, see:** https://github.com/horizon-games/SkyWeaver-desktop/releases

**To build your own:**
1. Clone this repo
2. `yarn install`
3. Build image -- for Mac: `yarn dist:mac`, for Windows: `yarn dist:windows`, for Linux: `yarn dist:linux`
4. Find the distribution for your os in dist/


## NixOS devs

For nixos, you must use the shell.nix which is a mini x11 environment so that
electron installs and is able to link without needing patchelf.

Simply run, `nix-shell`, then inside, `yarn dev`


## Signing Builds

### Mac OS

1. Ensure your `Certificates.p12` is in the root folder, they can be generated following [this guide](https://help.apple.com/xcode/mac/current/#/dev154b28f09/) , the different types of certs are described [here](https://developer.apple.com/support/certificates/) , make sure they are downloaded and in your keychain.
2. Create an [apple id](https://appleid.apple.com/) and generate an [app-specific password](https://support.apple.com/en-us/HT204397)
3. Create an `.env` file like this 
   
   ``` bash 
    APPLEID=my-apple-id
    APPLEIDPASS=my-app-specific-password
    CSC_LINK=./Certificates.p12
4. Run ``` yarn run dist``` 



### Windows

1. Download the [Code Signing Certificate](https://docs.microsoft.com/en-us/windows-hardware/drivers/dashboard/get-a-code-signing-certificate)
2. If you are using an EV Certificate, you need to provide `win.certificateSubjectName` in your [electron-builder configuration](https://www.electron.build/configuration/win).
3. If you are on Linux or Mac and you want sign a Windows app using EV Code Signing Certificate, please use [the guide for Unix systems](https://www.electron.build/tutorials/code-signing-windows-apps-on-unix).

### Any issues check out [this link](https://www.electron.build/code-signing)


