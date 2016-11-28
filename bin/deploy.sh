#!/bin/bash -e
REPO_URI="https://ubuntu:$FLYNN_KEY@git.v6jv.flynnhub.com/ourcities-rebu-client-develop.git"
if [[ "$CIRCLE_BRANCH" == "master" ]]; then
  REPO_URI="dokku@reboo.org:0-client"
fi

git fetch --unshallow origin

git remote add deploy $REPO_URI

GIT_SSL_NO_VERIFY=true git push -f deploy $CIRCLE_SHA1:refs/heads/master
