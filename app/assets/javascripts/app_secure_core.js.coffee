require ['jquery'], ($) ->
  require ['lib/core/base', 'flamsteed', 'lib/utils/scroll_perf', 'polyfills/function_bind', 'trackjs', 'polyfills/xdr'], (Base, _FS, ScrollPerf) ->
    $ ->
      config =
        secure: true
      base = new Base(config)
      new ScrollPerf
      window.lp.fs = new _FS({events: window.lp.fs.buffer, u: $.cookies.get('lpUid')})
