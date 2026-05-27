#!/usr/bin/env bash
# Render start step: run the Sidekiq worker (background sync) alongside Puma.
# SQLite lives on a single persistent disk, so both processes share one service.
set -o errexit

mkdir -p tmp/pids

bundle exec sidekiq &
bundle exec puma -C config/puma.rb
