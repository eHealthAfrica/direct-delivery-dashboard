#!/bin/bash

if [[ "$TRAVIS_TAG" ]]; then
  export NODE_ENV="travis-production"
elif [[ "$TRAVIS_BRANCH" == "master" ]]; then
  export NODE_ENV="travis-staging"
else
  export NODE_ENV="travis-development"
fi

npm run build
# gzip without the '.gz' suffix so S3 uses the original Content-Type header
find . -type f -exec gzip "{}" \; -exec mv "{}.gz" "{}" \;
