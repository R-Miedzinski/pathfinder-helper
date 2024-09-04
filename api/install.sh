#!/bin/bash


## install shared package
cd ../shared
sh -c "npm install && npm run build"

cd dist/
sh -c "npm link"

## install app
cd ../../app
sh -c "npm install && npm link rpg-app-shared-package"