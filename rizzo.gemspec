# -*- encoding: utf-8 -*-
require File.expand_path('../lib/rizzo/version', __FILE__)

Gem::Specification.new do |gem|
  gem.authors       = ["Marc"]
  gem.email         = ["marcky.sharky@googlemail.com"]
  gem.description   = %q{LonelyPlanet user interface engine for Rails}
  gem.summary       = %q{Rails engine for centralising user interface logic}
  gem.homepage      = "http://www.lonelyplanet.com"

  gem.files         = `git ls-files`.split($\)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(spec|features)/})
  gem.name          = "rizzo"
  gem.require_paths = ["lib"]
  gem.version       = Rizzo::VERSION

  gem.add_development_dependency 'rspec', '2.10.0'
  gem.add_development_dependency 'rspec-rails', '2.10.0'
  gem.add_development_dependency 'guard'
  gem.add_development_dependency 'guard-rspec'
  gem.add_development_dependency 'rails'
  gem.add_development_dependency 'haml', '3.1.4'
  gem.add_development_dependency 'sass', '3.2.0.alpha.237'
  gem.add_development_dependency 'capybara'
  gem.add_development_dependency 'cucumber', '1.1.9'
  gem.add_development_dependency 'guard-cucumber'
  gem.add_development_dependency 'pickle'
  gem.add_development_dependency 'cucumber-rails'
  gem.add_development_dependency 'rake'
end
