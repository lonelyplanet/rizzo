require File.expand_path('../boot', __FILE__)

require "action_controller/railtie"
require "sprockets/railtie"

if defined?(Bundler)
  Bundler.require(*Rails.groups(:assets => %w(development test)))
end

module Rizzo
  class Application < Rails::Application

    config.autoload_paths += %W(#{config.root}/lib)
    config.autoload_paths += %W(#{config.root}/lib/api)

    config.encoding = "utf-8"
    config.filter_parameters += [:password]
    config.active_support.escape_html_entities_in_json = true
    config.assets.enabled = true
    config.assets.version = '1.0'

    config.assets.precompile += ['common_core.css', 'common_core_ie.css', 'common_core_overrides.css', 'common_core_overrides_ie.css', 'common_legacy.css', 'common_legacy_ie.css', 'errbit_notifier.js']

  end
end
