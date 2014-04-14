require ['jquery'], ($) ->
  require ['lib/core/base', 'flamsteed', 'lib/utils/scroll_perf', 'polyfills/function_bind', 'trackjs', 'polyfills/xdr'], (Base, _FS, ScrollPerf) ->
    $ ->
      base = new Base()
      new ScrollPerf

      # Currently we can't serve Flamsteed over https because of f.staticlp.com
      # New community is using this file rather than app_secure_core
      # Trello card: https://trello.com/c/2RCd59vk/201-move-f-staticlp-com-off-cloudfront-and-on-to-fastly-so-we-can-serve-over-https
      unless window.location.protocol is "https:"
        window.lp.fs = new _FS({events: window.lp.fs.buffer, u: $.cookies.get('lpUid')})

      require ['sailthru'], ->
        Sailthru.setup(domain: 'horizon.lonelyplanet.com')
