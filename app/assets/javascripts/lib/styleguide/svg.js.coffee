require ['jquery'], ($) ->
  content = $(document.body)
  intro = content.find('.styleguide-intro--icons')
  colorFilter = intro.find('#js-icon-filter')
  colorSelect = intro.find('.js-select')
  icons = content.find('.js-icon')
  iconCards = icons.parent('.js-card')
  iconColors = []

  colorSelect.length && $.each colorSelect.get(0).options, (_, option) ->
    iconColors.push('icon--' + option.value)

  setIconColor = (color) ->
    icons.removeClass(iconColors.join(' '))
    icons.addClass('icon--' + color)
    color is 'white' and icons.parent().addClass('is-white') or icons.parent().removeClass('is-white')

  colorSelect.on 'change', (event) -> setIconColor(this.value)

  colorFilter.on 'keyup', (event) ->
    query = this.value
    iconCards.addClass('is-hidden').each () ->
      element = $(this)
      element.data('icon').match(query) and element.removeClass('is-hidden')
