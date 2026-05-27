#!/usr/bin/env bash
# Render build step: install dependencies and precompile assets.
set -o errexit

bundle install
yarn install
bundle exec rake assets:precompile
