if Rails.env.production? && defined?(Airbrake)
  Airbrake.configure do |config|
    config.project_key = ENV['AIRBRAKE_PROJECT_KEY']
    config.project_id = ENV['AIRBRAKE_PROJECT_ID']
  end
end
