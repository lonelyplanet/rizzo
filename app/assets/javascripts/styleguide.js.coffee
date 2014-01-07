require ['jquery', 'lib/managers/select_group_manager', 'pickadate/lib/picker', 'pickadate/lib/picker.date', 'pickadate/lib/legacy'], ($, SelectGroupManager) ->

  $ ->
    selectGroupManager = new SelectGroupManager()

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
      min: [d.getFullYear(), (d.getMonth() + 1), d.getDate()]
    })
