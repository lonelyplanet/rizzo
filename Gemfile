source 'https://rubygems.org'

gem 'rails', '3.2.18'
gem 'haml'
gem 'sass'
gem 'sass-globbing'
gem 'haml-rails'
gem 'sass-rails', '~> 3.2.3'
gem 'coffee-rails','3.2.2'
gem 'coffee-script-source', '1.4.0'
gem 'requirejs-rails', git: 'https://github.com/lonelyplanet/requirejs-rails.git'
gem 'uglifier', '>= 1.0.3'
gem 'autoprefixer-rails'
gem 'unicorn'
gem 'rake'
gem 'sanitize'
gem 'dotenv'

group :test do
  gem 'rspec', '~> 2.10.0'
  gem 'rspec-rails'
  gem 'rubyzip', '< 1.0.0'

  gem 'selenium-webdriver', '2.26.0'
  gem 'capybara', '< 2.0.0'
  gem 'cucumber'
  gem 'cucumber-rails', :require => false
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'pry-rails'
end

group :production do
  gem "lograge"
  gem "logstash-event"
  gem "airbrake"
end
