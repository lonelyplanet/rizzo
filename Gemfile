source 'https://rubygems.org'

gem 'rails', '~> 4.1.8'
gem 'haml'
gem 'sass'
gem 'sass-globbing'
gem 'haml-rails'
gem 'sass-rails'
gem 'requirejs-rails'
gem 'sprockets'
gem 'uglifier'
gem 'autoprefixer-rails'
gem 'unicorn'
gem 'rake'
gem 'dotenv'
gem 'redcarpet'
gem 'image-resizer', git: 'https://github.com/lonelyplanet/image-resizer.git', require: 'image_resizer'
gem 'typhoeus'

group :test do
  gem 'rspec-rails', '~> 2.14.0'
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
  gem "airbrake", "~> 5"
end
