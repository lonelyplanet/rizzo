require ['jquery', 'lib/core/base', 'flamsteed'], ($, Base, _FS) ->
  $ ->
    base = new Base()
    window.lp = window.lp || {}
    window.lp.fs = new _FS({events: window.fs.buffer})
    require ['//ak.sail-horizon.com/horizon/v1.js'], ->
      Sailthru.setup(domain: 'horizon.lonelyplanet.com')
