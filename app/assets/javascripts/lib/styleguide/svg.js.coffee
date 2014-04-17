require ['jquery'], ($) ->
  content = $(document.body)
  intro = content.find('.styleguide-intro--icons')
  colorFilter = intro.find('#js-icon-filter')
  colorSelect = intro.find('.js-select')
  icons = content.find('.js-icon')
  iconCards = icons.closest('.js-card')
  intro = $('.js-intro-section')
  iconColors = []

  colorSelect.length && $.each colorSelect.get(0).options, (_, option) ->
    iconColors.push('icon--' + option.value)

  colorSelect.on 'change', (event) -> setIconColor(this.value)

  colorFilter.on 'keyup', (event) ->
    query = this.value
    iconCards.addClass('is-hidden').each () ->
      element = $(this)
      element.data('icon').match(query) and element.removeClass('is-hidden')

    if (iconCards.filter('.is-hidden').length)
      intro.addClass('is-closed')
    else
      intro.removeClass('is-closed')

  setIconColor = (color) ->
    icons.removeClass(iconColors.join(' '))
    icons.addClass('icon--' + color)
    color is 'white' and icons.parent().addClass('is-white') or icons.parent().removeClass('is-white')
