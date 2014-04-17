# Protect legacy apps that already define jquery downloading it again
if !!window.jQuery then define('jquery', [], -> window.jQuery )

require ['jquery'], ($) ->
  require ['lib/core/base', 'polyfills/function_bind', 'flamsteed', 'polyfills/xdr'], (Base, _FS) ->
    $ ->
      config =
        secure: true
      base = new Base(config)
      window.lp.fs = new _FS({events: window.lp.fs.buffer, u: $.cookies.get('lpUid')})
