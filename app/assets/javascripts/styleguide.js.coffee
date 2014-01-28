require ['jquery'], ($) ->
  require [
    'lib/managers/select_group_manager'
    'pickadate/lib/picker'
    'pickadate/lib/picker.date'
    'pickadate/lib/legacy'
    'lib/styleguide/ajax-content'
    'lib/styleguide/copy'
    'lib/styleguide/snippet-expand'
    'lib/styleguide/svg'
    'lib/styleguide/colours'
    'nouislider/jquery.nouislider'
  ], (SelectGroupManager) ->

    $ ->
      new SelectGroupManager()

      d = new Date()
      $('.input--datepicker').pickadate({
        min: [d.getFullYear(), (d.getMonth() + 1), d.getDate()]
      })

      $('.test-area').noUiSlider({
        range: [ 0, 100 ],
        start: [25, 75],
        connect: true,
        handles: 2
      })
