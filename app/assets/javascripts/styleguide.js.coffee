require ['jquery', 'lib/core/base'], ($, Base) ->

  $ ->
    base = new Base()

    require ['lib/styleguide/extras', 'lib/styleguide/ajax-content', 'lib/styleguide/copy'], ->
      extras.load()
      if $('.js-colours').length > 0
        require ['lib/styleguide/colours']