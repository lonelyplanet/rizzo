define ["jquery"], ($)->

  class AssetReveal

    defaults =
      el: '#js-row--content'

    constructor: (args) ->
      @config = $.extend({}, defaults, args)
      @$listener = $(@config.el)
      @listen() unless @$listener.length is 0

    # Subscribe
    listen: ->
      @$listener.on ':asset/uncomment', (e, elements, klass) =>
        if e.data
          elements = e.data[0]
          klass = e.data[1]
        @_uncomment(elements, klass || '[data-uncomment]')

      @$listener.on ':asset/uncommentScript', (e, elements, klass) =>
        if e.data
          elements = e.data[0]
          klass = e.data[1]
        @_uncommentScript(elements, klass || '[data-script]')

      @$listener.on ':asset/loadBgImage', (e, elements) =>
        @_loadBgImage(elements)

      @$listener.on ':asset/loadDataSrc', (e, elements) =>
        @_loadDataSrc(elements)


    # Private

    _normaliseArray: (elements) ->
      if !!elements.splice then elements else [elements]

    _removeComments: (html) ->
      html.replace("<!--", "").replace("-->", "")

    _uncomment: (selector, klass) ->

      if window.lp.isMobile
        for elem in @_normaliseArray(selector)
          $commented = $(elem).find(klass)
          if $commented.length isnt 0
            inner = @_removeComments($commented.innerHTML)
            $commented.parentNode.innerHTML += inner
      else
        $commented = $(selector).find(klass).each( (i, node) =>
          inner = @_removeComments($(node).html())
          $(node).before(inner).remove()
        )

    # Uncommenting a script is a bit trickier if you want that script to be immediately executed
    # Currently only works with jquery (not yet required for mobile)
    _uncommentScript: (selector, klass) ->
      process = (node) =>
        uncommented = @_removeComments(node.html())
        node.html(uncommented)

      for elem in @_normaliseArray(selector)
        $commented = $(elem).find(klass)
        process($commented) if $commented.length isnt 0

    _loadBgImage: (selector) ->
      $element = $(selector)
      if $element.hasClass('rwd-image-blocker')
        $element.removeClass('rwd-image-blocker')
      else
        $element.find('.rwd-image-blocker').removeClass('rwd-image-blocker')

    _loadDataSrc: (selector) ->
      $elements = $(selector)

      $elements.each (i, element) ->
        $element = $elements.eq(i)

        if not $element.attr('data-src')
          $element = $element.find('[data-src]')

        data = $element.data()

        return unless data

        $img = $('<img />')

        for attr, val of data
          $img.attr(attr, val)

        $element.replaceWith($img)
