#!/bin/bash

if [[ "$TRAVIS_TAG" ]]; then
  export NODE_ENV="travis-production"
elif [[ "$TRAVIS_BRANCH" == "master" ]]; then
  export NODE_ENV="travis-staging"
else
  export NODE_ENV="travis-development"
fi

npm run build
