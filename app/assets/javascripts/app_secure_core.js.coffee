require.config(
  paths:
    jquery: "http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min"
    jplugs: "jquery/plugins"
)

require ['jquery', 'lib/core/base'], ($, Base) ->
  $ ->
    config = 
      secure: true
    base = new Base(config)



