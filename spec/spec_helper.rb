# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)

require 'rspec/rails'
require 'rspec/autorun'
require 'haml'

Dir[File.expand_path('../support/**/*.rb', __FILE__)].each(&method(:require))

RSpec.configure do |config|
  config.infer_base_class_for_anonymous_controllers = false
  config.include DataFixturesHelper
  config.include RSpec::Rails::ViewExampleGroup, :type => :model, :example_group => {
    :file_path => config.escaped_path(%w[spec assets])
  }
end
