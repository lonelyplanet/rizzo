require "rizzo/version"
require "rizzo/url_encryptor"

module Rizzo::Assets

  def self.precompile
    [
      'rizzo-next.css',
      'core.css',
      'core_ie.css',
      'core_fixed_width.css',
      'core_legacy.css',
      'core_legacy_ie.css',
      'omniture/s_code.js',
      'prism.js',
      'prism.css',
      'icons/active.css',
      'icons/critical.css',
      'fonts.css',
      "fonts_woff2.css",
      'styleguide.css',
      'requirejs/require.js',
      'd3/d3.js',
      'nvd3/nv.d3.js',
      'nvd3/nv.d3.min.css'
    ]
  end

  def self.precompile_as_engine
    [
      'rizzo-next.css',
      'core.css',
      'core_ie.css',
      'core_fixed_width.css',
      'omniture/s_code.js',
      'requirejs/require.js',
      'icons/active.css',
      'icons/critical.css',
      "fonts.css",
      "fonts_woff2.css"
    ]
  end

end
