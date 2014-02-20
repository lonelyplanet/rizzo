require ['jquery'], ($) ->
  require [
    'lib/managers/select_group_manager'
    'lib/utils/scroll_perf'
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
    'lib/utils/feature_detect'
  ], (SelectGroupManager, ScrollPerf) ->

    new ScrollPerf

    $ ->
      new SelectGroupManager()
      d = new Date()
      $('.input--datepicker').pickadate({
        min: [d.getFullYear(), (d.getMonth() + 1), d.getDate()]
      })
