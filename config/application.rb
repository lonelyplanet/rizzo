require File.expand_path('../boot', __FILE__)
require "action_controller/railtie"
require 'haml'

Bundler.require(*Rails.groups(:assets => %w(development test))) if defined?(Bundler)

module Rizzo
  class Application < Rails::Application

    config.assets.paths << Rails.root.join("app", "assets", "html")

  end
end
