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
    'lib/styleguide/typography'
    'lib/utils/scroll_perf'
  ], (SelectGroupManager) ->

    $ ->
      new SelectGroupManager()
      d = new Date()
      $('.input--datepicker').pickadate({
        min: [d.getFullYear(), (d.getMonth() + 1), d.getDate()]
      })
