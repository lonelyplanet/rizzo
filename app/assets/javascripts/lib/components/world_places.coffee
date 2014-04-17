# not sure where this should live
$('.js--item[data-continent]').on('click', (event) ->
  element = $(event.target)
  continent = element.data('continent')
  $('.js-continent').hide().filter('.js-continent-' + continent).show()
  $('.js--item').removeClass('is-active')
  element.addClass('is-active')
  event.preventDefault();
)
# also i apologise for this but it was made quite clear that i must rush.
$('.js--item[data-continent="africa"]').click()
