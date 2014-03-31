# AutoComplete
#
# TODO: - there's a bug with accented characters, they aren't being highlighted
#         (http://frightanic.com/projects/jquery-highlight/ as an example)
#       - abstract the XHR code to a separate library
#
# Arguments:
#   _args (An object containing)
#     id                      : [string] The target form element
#     uri                     : [string] The search endpoint
#     scope                   : [string] (Optional) Value to specify as the scope of the search
#     threshold               : [number] (Optional) The number of characters required before searching
#     throttle                : [number] (Optional) Time in ms to throttle requests to search endpoint
#     resultsClass            : [string] (Optional) Class name for results list element
#     resultItemClass         : [string] (Optional) Class name for result list item element
#     resultLinkClass         : [string] (Optional) Class name for result list link element
#     resultItemHoveredClass  : [string] (Optional) Class name for hovered
#     map                     : [object] (Optional) Endpoint mappings
#     inputCallback           : [function] (Optional) when something has been entered in the input element
#     selectCallback          : [function] (Optional) when an item has been selected
#     showResultsCallback     : [function] (Optional) when the results list has been displayed
#     removeResultsCallback   : [function] (Optional) when the results list has been removed
#
# Map:
#   Maps an endpoint key to the component's expected key
#     title : [string]
#     type  : [string]
#     uri   : [string]
#     data  : [array of strings] adds data attribute on the list item for each value
#
# Example:
#  args =
#    id: 'my_search'
#    uri: '/search'
#
#  new AutoComplete(args)
#
# Dependencies:
#   None

define [], ->

  class AutoComplete

    DEFAULTS =
      threshold: 3
      resultsClass: 'autocomplete__results'
      resultItemClass: 'autocomplete__result'
      resultLinkClass: 'autocomplete__result__link'
      resultItemHoveredClass: 'autocomplete__current'
      throttle: 200
      map:
        title: 'title',
        type: 'type',
        uri: 'uri'

    KEY =
      tab: 9,
      enter: 13,
      esc: 27,
      up: 38,
      down: 40

    constructor: (args) ->
      @_init args if args.id and args.uri

    _init: (args) ->
      @config = @_updateConfig args
      @el = document.getElementById @config.id
      @xhr = @_setupXHR()
      @_addEventHandlers()
      @results = @_buildResults()

    _updateConfig: (args) ->
      newConfig = {}
      newConfig[key] = value for own key, value of DEFAULTS
      newConfig[key] = value for own key, value of args
      newConfig

    _addEventHandlers: ->
      @_on(@el, 'input', (e) =>
        @_searchFor e.currentTarget.value
      )
      @_on(@el, 'keydown', (e) =>
        @_keypressHandler e
      )

    _setupXHR: ->
      xhr = new XMLHttpRequest()
      @_on(xhr, 'readystatechange', =>
        if @xhr.readyState == 4
          if @xhr.status == 200
            @_populateResults JSON.parse(@xhr.responseText), @currentSearch
      )
      xhr

    _buildResults: ->
      results = document.createElement 'UL'
      @_addClass results, @config.resultsClass
      @_addClass results, "#{@config.resultsClass}--#{@config.classModifier}" if @config.classModifier

      @_on(results, 'click', (e) =>
        @_resultsClick e
      , false)

      @_on(results, 'mouseover', (e) =>
        @_resultsMouseOver e.target
      , false)

      @_on(results, 'mouseout', (e) =>
        @_resultsMouseOut e.target
      , false)
      results

    # event handlers
    _keypressHandler: (e) ->
      if @results.displayed
        switch e.keyCode
          when KEY.up
            e.preventDefault()
            @_highlight('up')
          when KEY.down
            e.preventDefault()
            @_highlight('down')
          when KEY.tab
            e.preventDefault()
            if e.shiftKey
              @_highlight('up')
            else
              @_highlight('down')
          when KEY.enter
            if @results.highlighted
              e.preventDefault()
              @_handleEnter()
          when KEY.esc
            @_handleCancel()

    _resultsClick: (e) ->
      target = e.target

      # If the user clicked on the highlighted section of the result, check its parent
      target = target.parentNode if target.tagName == 'B'

      # if the real target was an anchor, prevent the event from bubbling so the text isn't selected
      if target.tagName == 'A'
        e.stopPropagation()
      else if target.tagName == 'LI'
        @results.highlighted = target
        @_selectCurrent()

    _resultsMouseOver: (target) ->
      until target.tagName is 'LI'
        target = target.parentNode

      @_clearHighlight()
      @results.highlighted = target
      @results.hovered = true
      @_highlightCurrent()

    _resultsMouseOut: ->
      @_clearHighlight()
      @results.hovered = false
      @results.highlighted = false

    _selectCurrent: ->
      @el.value = @results.highlighted.textContent
      @config.selectCallback.call @results.highlighted if @config.selectCallback
      @_removeResults()

    _highlight: (direction) ->
      if not @results.highlighted
        if direction is 'up'
          @results.highlighted = @results.lastChild
        if direction is 'down'
          @results.highlighted = @results.firstChild
      else
        if direction is 'up'
          unless @results.highlighted.previousSibling == null
            @_removeClass(@results.highlighted, @config.resultItemHoveredClass) if @results.highlighted
            @results.highlighted = @results.highlighted.previousSibling
        if direction is 'down'
          unless @results.highlighted.nextSibling == null
            @_removeClass(@results.highlighted, @config.resultItemHoveredClass) if @results.highlighted
            @results.highlighted = @results.highlighted.nextSibling
      @_highlightCurrent()

    _highlightCurrent: ->
      @_addClass @results.highlighted, @config.resultItemHoveredClass

    _clearHighlight: ->
      @_removeClass(@results.highlighted, @config.resultItemHoveredClass) if @results.highlighted

    # keypress handlers
    _handleEnter: ->
      # check if the child of the selected node is a link
      highlighted = @results.highlighted.firstChild
      if highlighted.tagName == 'A'
        # it's a link, change the href
        @_navigateTo highlighted.href
      else
        @_selectCurrent()

    _handleCancel: ->
      @el.value = ''
      @_removeResults() if @results.displayed

    _navigateTo: (location) ->
      window.location = location

    _searchFor: (searchTerm) ->
      if searchTerm?.length >= @config.threshold
        @_doSearch searchTerm unless @throttled
      else if @results.displayed
        @_removeResults()
      @config.inputCallback.call @el if @config.inputCallback

    _makeRequest: (searchTerm) ->
      if searchTerm != ''
        @xhr.open 'get', @_generateURI(searchTerm, @config.scope)
        @xhr.setRequestHeader 'Accept', '*/*'
        @xhr.send()

    _doSearch: (searchTerm) ->
      unless @xhr.readyState == 4
        @xhr.abort()

      @currentSearch = searchTerm
      if @config.throttle > 0
        @throttled = true
        setTimeout =>
          @_throttleTimeout()
        , @config.throttle
      @_makeRequest searchTerm

    _throttleTimeout: ->
      @throttled = false
      @_doSearch @el.value if @currentSearch != @el.value

    _generateURI: (searchTerm, scope) ->
      uri = "#{@config.uri}#{searchTerm}"
      uri += "?scope=#{scope}" if scope
      uri

    _populateResults: (resultItems, searchTerm) ->
      @_emptyResults()

      resultItems = resultItems.slice(0, @config.limit) if @config.limit

      @results.appendChild(@_createListItem listItem, searchTerm) for listItem in resultItems
      @_showResults() unless @results.displayed

    _showResults: ->
      @el.parentNode.insertBefore @results, @el.nextSibling # insertAfter @el
      @results.displayed = true
      @config.showResultsCallback.call @el if @config.showResultsCallback

    _removeResults: ->
      @results.parentNode.removeChild @results
      @results.displayed = false
      @results.highlighted = false
      @config.removeResultsCallback.call @el if @config.removeResultsCallback

    _emptyResults: ->
      @results.innerHTML = ''

    _createListItem: (item, searchTerm) ->
      listItem = document.createElement 'LI'
      @_addClass listItem, @config.resultItemClass

      highlightedText = @_highlightText item[@config.map.title], searchTerm

      if @config.map.uri? and item[@config.map.uri]?
        anchor = document.createElement 'A'
        anchor.href = item[@config.map.uri]
        anchor.className = "#{@config.resultLinkClass} icon--white--before"
        if item.icon
          anchor.className += " #{item.icon}--before"
        else if item[@config.map.type] == 'place'
          anchor.className += ' icon--place--pin--before'
        else
          anchor.className += " icon--#{item[@config.map.type]}--before"
        @config.map.type && anchor.className += " autocomplete__result__typed"
        anchor.innerHTML = highlightedText
        listItem.appendChild anchor
      else
        listItem.innerHTML = highlightedText

      if @config.map.data?
        listItem.setAttribute("data-#{key}", item[key]) for key in @config.map.data

      listItem

    _highlightText: (text, term) ->
      regex = new RegExp term, 'ig'
      text.replace regex, "<b>$&</b>"

    # utility functions
    _on: (elt, evt, callback) ->
      if window.addEventListener
        elt.addEventListener evt, callback, false
      else if window.attachEvent
        elt.attachEvent "on#{evt}", callback

    _addClass: (item, _class) ->
      if (item.className.indexOf _class) < 0
        item.className += " #{_class}"

    _removeClass: (item, _class) ->
      reg = new RegExp ' ?'+_class, 'g'
      item.className = item.className.replace reg, ''
