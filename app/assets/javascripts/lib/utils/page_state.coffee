define [], () ->

  class PageState

    checkFilters: /filters/
    checkSearch: /search/
    legacyBrowsers: /(browser)?ie(7|8)/i

    getUrl: ->
      window.location.href

    getSlug: ->
      window.location.pathname

    getParams: ->
      window.location.search.replace(/^\?/, '')

    getHash: ->
      window.location.hash

    getViewPort: ->
      document.documentElement.clientWidth

    getLegacyRoot: ->
      if @legacyBrowsers.test(document.documentElement.className)
        document.documentElement
      else if @legacyBrowsers.test(document.body.className)
        document.body

    getDocumentRoot: ->
      slug = @getSlug()
      @createDocumentRoot(slug)

    isLegacy: ->
      !!@getLegacyRoot()

    setUrl: (url) ->
      window.location.replace(url)

    setHash: (hash) ->
      window.location.hash = hash

    createDocumentRoot: (slug) ->
      if @withinFilterUrl()
        newSlug = slug.split('/')
        newSlug.pop() && newSlug.join('/')
      else
        slug

    withinFilterUrl: ->
      cardHolder = document.getElementById('js-card-holder')
      return cardHolder && cardHolder.getAttribute("data-filter-subcategory") == "true"

    hasFiltered: ->
      return @withinFilterUrl() or @checkFilters.test(@getParams())

    hasSearched: ->
      params = @getParams()
      @checkSearch.test(params)
