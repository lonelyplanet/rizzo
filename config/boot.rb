require 'rubygems'

# Set up gems listed in the Gemfile.
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)

require 'bundler/setup' if File.exists?(ENV['BUNDLE_GEMFILE'])

require 'dotenv'
Dotenv.tap do |de|
  de.load
  de.load(ENV['RIZZO_ENV']) if ENV['RIZZO_ENV']
end
