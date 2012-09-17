# Be sure to restart your server when you modify this file.

Rizzo::Application.config.session_store :cookie_store, key: '_sed_session'  if defined?(Rizzo::Application)

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rails generate session_migration")
# Sed::Application.config.session_store :active_record_store
