#!/bin/bash

# start in bacon-comp
baconCompBase='/Users/tedshaffer/Documents/bacon-comp'

cd $baconCompBase/bacon
pwd

cd $baconCompBase/bsAutoplayGenerator
npm link typescript
npm run package

cd $baconCompBase/ba-context-model
npm link typescript
npm run package

cd $baconCompBase/ba-schedule
npm link typescript
npm run package

cd $baconCompBase/ba-uw-dm
npm link typescript
npm run package

cd $baconCompBase/ba-uw-manager
npm link typescript
npm run package

cd $baconCompBase/bacon-theme
npm link typescript
npm run build

cd $baconCompBase/baconcore
npm link typescript
npm run package

cd $baconCompBase/bpfimporter
npm link typescript
npm run build

cd $baconCompBase/bs-content-manager
npm run linkGlobalPackages
npm run package

# cd $baconCompBase/bs-device-artifacts

cd $baconCompBase/bs-playlist-dm
npm link typescript
npm run package

cd $baconCompBase/bs-widgets
npm link typescript
npm run build

cd $baconCompBase/bscore
npm link typescript
npm run package

cd $baconCompBase/bsdatamodel
npm link typescript
npm run package

cd $baconCompBase/bsdevicesetup
npm link typescript
npm run build

# cd $baconCompBase/bsn-ui-v2-ns
# npm run package

cd $baconCompBase/bsnconnector
npm link typescript
npm run package

cd $baconCompBase/bspublisher
npm link typescript
npm run build

cd $baconCompBase/fsconnector
npm link typescript
npm run package

cd $baconCompBase/fsmetadata
npm link typescript
npm run package

cd $baconCompBase/ba-context-model
npm link typescript
npm run package

cd $baconCompBase/bacon
npm run static-builder-desktop





