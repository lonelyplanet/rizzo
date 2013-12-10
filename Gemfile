source 'https://rubygems.org'

gem 'rails', '3.2.16'
gem 'haml'
gem 'sass'
gem 'haml-rails'
gem 'sass-rails', '~> 3.2.3'
gem 'coffee-rails','3.2.2'
gem 'coffee-script-source', '1.4.0'
gem 'requirejs-rails'
gem 'uglifier', '>= 1.0.3'
gem 'unicorn'
gem 'rake'
gem 'airbrake'

group :test do 
  gem 'guard'
  gem 'guard-coffeescript'
  gem 'rspec', '~> 2.10.0'
  gem 'rspec-rails'
  gem 'guard-rspec'
  gem 'rubyzip', '< 1.0.0'

  gem 'selenium-webdriver', '2.26.0'
  gem 'capybara', '< 2.0.0'
  gem 'cucumber'
  gem 'cucumber-rails', :require => false
  gem 'launchy'

  gem 'guard-cucumber'
  gem 'rb-fsevent', '~> 0.9.1'
end

group :development do
  gem 'better_errors'
  gem "binding_of_caller"
end

group :production do
  gem "lograge"
  gem "logstash-event"
end