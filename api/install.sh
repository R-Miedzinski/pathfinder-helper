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

rm -rf ../app/web
mv -f dist ../app/web


## install app
cd ../app
sh -c "npm install && npm link rpg-app-shared-package"
