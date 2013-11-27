require ['jquery', 'lib/core/base'], ($, Base) ->

  $ ->
    base = new Base()

    require ['lib/styleguide/ajax-content', 'lib/styleguide/copy', 'lib/styleguide/snippet-expand']

    if $('.js-colours').length > 0
      require ['lib/styleguide/colours']