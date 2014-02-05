require ['jquery'], ($) ->
  require [
    'lib/managers/select_group_manager'
    'lib/components/range_slider'
    'pickadate/lib/picker'
    'pickadate/lib/picker.date'
    'pickadate/lib/legacy'
    'lib/styleguide/ajax-content'
    'lib/styleguide/copy'
    'lib/styleguide/snippet-expand'
    'lib/styleguide/svg'
    'lib/styleguide/colours'
  ], (SelectGroupManager, RangeSlider) ->

    $ ->
      new SelectGroupManager()
      new RangeSlider()

      d = new Date()
      $('.input--datepicker').pickadate({
        min: [d.getFullYear(), (d.getMonth() + 1), d.getDate()]
      })
