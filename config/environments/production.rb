Rizzo::Application.configure do

  config.cache_classes = true
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true
  config.serve_static_assets = true
  config.assets.compress = true
  config.assets.compile = false
  config.assets.digest = true
  config.assets.initialize_on_precompile = false
  config.assets.debug = false
  config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for nginx
  config.i18n.fallbacks = true
  config.active_support.deprecation = :notify

  config.lograge.enabled = true
  config.lograge.log_format = :logstash

  # Enable serving of images, stylesheets, and JavaScripts from an asset server
  config.action_controller.asset_host = "//" << (ENV['RAILS_ASSET_DOMAIN'] || "assets.staticlp.com")

end if defined?(Rizzo::Application)

