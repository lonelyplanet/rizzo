# Protect legacy apps that already define jquery downloading it again
if !!window.jQuery then define('jquery', [], -> window.jQuery )

require ['jquery', 'lib/core/base', 'flamsteed'], ($, Base, _FS) ->
  $ ->
    base = new Base()
    window.lp.fs = new _FS({events: window.lp.fs.buffer, u: $.cookies.get('lpUid')})
