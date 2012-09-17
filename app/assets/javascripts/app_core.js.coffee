require.config(
  paths:
    jquery: "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min"
    jplugs: "jquery/plugins"
)

require ['jquery', 'lib/core/base'], ($, Base) ->
  $ ->
    base = new Base()



