require "rizzo/version"
require "rizzo/url_encryptor"

module Rizzo::Assets
  def self.precompile
    [
      'common_core.css',
      'common_core_ie.css',
      'common_core_no_font.css',
      'common_core_no_font_ie.css',
      'common_core_overrides.css',
      'common_core_overrides_ie.css',
      'common_legacy.css',
      'common_legacy_ie.css',
      'flamsteed.js',
      'omniture/s_code.js',
      'prism.js',
      'prism.css',
      'icons/active.css',
      'icons/critical.css',
      'fonts.css',
      'styleguide.css',
      'jquery/jquery.js',
      'requirejs/require.js',
      'nvd3/nv.d3.min.css'
    ]
  end
end
