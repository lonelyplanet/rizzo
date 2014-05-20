require ['jquery'], ($) ->
  require [
    'lib/managers/select_group_manager'
    'lib/utils/scroll_perf'
    'lib/utils/toggle_active'
    'lib/utils/konami'
    'lib/utils/swipe'
    'lib/components/range_slider'
    'lib/components/lightbox'
    'pickadate/lib/picker'
    'pickadate/lib/picker.date'
    'pickadate/lib/legacy'
    # 'lib/styleguide/ajax-content'
    'lib/styleguide/copy'
    'lib/styleguide/snippet-expand'
    'lib/styleguide/svg'
    'lib/styleguide/colours'
    'lib/styleguide/typography'
    'lib/styleguide/lightbox'
    'lib/styleguide/konami'
    'lib/styleguide/swipe'
    'lib/utils/feature_detect'
  ], (SelectGroupManager, ScrollPerf, ToggleActive, Konami, Swipe) ->

    new ScrollPerf()
    new SelectGroupManager()
    new ToggleActive()
    new Swipe()
    d = new Date()
    $('.input--datepicker').pickadate({
      min: [d.getFullYear(), (d.getMonth() + 1), d.getDate()]
    })

    new Konami()
