require ['jquery', 'lib/core/base', 'flamsteed'], ($, Base, _FS) ->
  $ ->
    config = 
      secure: true
    base = new Base(config)
    window.lp.fs = new _FS({events: window.lp.fs.buffer, u: $.cookies.get('lpUid')})
