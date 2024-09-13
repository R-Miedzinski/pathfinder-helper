#!/bin/bash


## install shared package
cd ../shared
sh -c "npm install && npm run build"

cd dist/
sh -c "npm link"
cd ../


## install web
cd ../web
sh -c "npm install && npm link rpg-app-shared-package"

sh -c "npm run build:docker"

rm -rf ../api/web
mv -f dist ../api/web


## install app
cd ../api
sh -c "npm install && npm link rpg-app-shared-package"

sh -c "npx tsc"