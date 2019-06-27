#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

curl -s -o "${DIR}/placetypes-spec-latest.json" \
  'https://raw.githubusercontent.com/whosonfirst/whosonfirst-placetypes/master/data/placetypes-spec-latest.json'