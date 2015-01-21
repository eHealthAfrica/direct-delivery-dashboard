#!/bin/bash

[[ "$TRAVIS_BRANCH" == "master" ]] && export NODE_ENV="production"
[[ "$TRAVIS_BRANCH" == "develop" ]] && export NODE_ENV="stage"
npm run build
