require ['jquery', 'lib/core/base', 'jplugs/pickadate.legacy'], ($, Base) ->

  $ ->
    base = new Base()

    require [
      'lib/styleguide/ajax-content'
      'lib/styleguide/copy'
      'lib/managers/select_group_manager'
      'lib/styleguide/snippet-expand'
      'lib/styleguide/svg'
    ]

    if $('.js-colours').length > 0
      require ['lib/styleguide/colours']

    d = new Date()
    $('.input--datepicker').pickadate({
      dateMin: [d.getFullYear(), (d.getMonth() + 1), d.getDate()]
    })
