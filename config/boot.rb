ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

require 'bundler/setup' # Set up gems listed in the Gemfile.

# Rails 6.1 references ::Logger before requiring it; newer concurrent-ruby no
# longer pulls it in, so load it explicitly before Rails boots on Ruby 3.3.
require 'logger'

require 'bootsnap/setup' # Speed up boot time by caching expensive operations.
