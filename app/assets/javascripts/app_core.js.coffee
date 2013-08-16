require ['jquery', 'lib/core/base', 'flamsteed'], ($, Base, _FS) ->
  $ ->
    base = new Base()
    window.lp.fs = new _FS({events: window.lp.fs.buffer})
    require ['sailthru'], ->
      Sailthru.setup(domain: 'horizon.lonelyplanet.com')
