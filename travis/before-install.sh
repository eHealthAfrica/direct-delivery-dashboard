#!/usr/bin/env bash
set -e

error() { echo "$0: $1"; exit 1; }

[[ "$TRAVIS" ]] || error "this script assumes it's running within TravisCI"
[[ "$TRAVIS_PULL_REQUEST" == "false" ]] || {
  cat << EOF
$TRAVIS_REPO_SLUG uses private dependencies and cannot currently be tested
against pull requests due to security restrictions.

If you are a authorised to view said private dependencies (and haven't already
done the following), please generate a GitHub API token, granting the "repos"
scope and add it to your fork's TravisCI environment variables as
"CI_USER_TOKEN".

Then, if your tests pass, please attach TravisCI's build URL to your pull
request for the maintainers' to review.

Thanks for your contribution!
EOF
  exit 1;
}

echo "machine github.com login $CI_USER_TOKEN" >> ~/.netrc