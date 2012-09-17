# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Rizzo::Application.initialize! if defined?(Rizzo::Application)
