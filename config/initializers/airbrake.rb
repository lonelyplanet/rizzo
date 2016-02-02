if Rails.env.production? && defined?(Airbrake)
  airbrake_version = Gem::Version.new(Airbrake::VERSION)
  new_version = Gem::Version.new('5.0')

  # There is a breaking change in Airbrake API. If an application tries to use
  # v5 it will crash. This means Rizzo locks out every application from being
  # updated.
  #
  # Skip airbrake config if an application uses v5.
  if airbrake_version < new_version
    Airbrake.configure do |config|
      config.api_key = ENV['AIRBRAKE_API_KEY']
    end
  end
end
