#!/usr/bin/env bash
set -e

info() { echo "$0: $1"; }
error() { info "$1"; exit 1; }
deploy() { info "Deploying $1 build"; }

decode_ssh_key() {
  echo -n $id_rsa_{00..30} >> ~/.ssh/id_rsa_base64
  base64 --decode --ignore-garbage ~/.ssh/id_rsa_base64 > ~/.ssh/id_rsa
  chmod 600 ~/.ssh/id_rsa
  echo -e "Host $1\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
}

# Only deploy on non-forks
[[ "TRAVIS_REPO_SLUG" == "eHealthAfrica/LMIS-Dashboard" ]] || exit 1

dist="dist"
[[ -d "$dist" ]] || error "$dist: no such directory"

if [[ "$TRAVIS_TAG" ]]; then
  deploy "release"
  host="lomis.ehealth.org.ng"
else
  deploy "snapshot"
  host="dev.lomis.ehealth.org.ng"
fi

decode_ssh_key "$host"

now="$(date -u "+%Y%m%d%H%M%S")"
rsync -avz -e ssh "$dist" travisci@$host:~/lmis-dashboard/$now/
