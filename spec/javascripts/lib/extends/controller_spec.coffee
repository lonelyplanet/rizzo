require ['public/assets/javascripts/lib/extends/controller.js'], (Controller) ->

  describe 'Controller', ->

    LISTENER = '#js-card-holder'

    serialized =
      url: "http://www.lonelyplanet.com/france/paris/hotels"
      urlWithSearchAndFilters: "http://www.lonelyplanet.com/england/london/hotels?utf8=✓&search%5Bpage_offsets%5D=0%2C58&search%5Bfrom%5D=29+May+2013&search%5Bto%5D=30+May+2013&search%5Bguests%5D=2&search%5Bcurrency%5D=USD&filters%5Bproperty_type%5D%5B3star%5D=true&filters%5Blp_reviewed%5D=true"
      urlParams: "utf8=✓&search%5Bfrom%5D=29+May+2013&search%5Bto%5D=30+May+2013&search%5Bguests%5D=2&search%5Bcurrency%5D=USD&filters%5Bproperty_type%5D%5B3star%5D=true&filters%5Blp_reviewed%5D=true"
      newUrlWithSearchAndFilters: "filters%5Bproperty_type%5D%5B4star%5D=true"

    deserialized =
      utf8: "✓"
      search:
        from: "29 May 2013"
        to: "30 May 2013"
        guests: "2"
        currency: "USD"
      filters:
        property_type:
          "3star": "true"
        lp_reviewed: "true"

    newParams =
      filters:
        property_type:
          "4star": true
      pagination:
        page_offsets: 2

    appendParams =
      page: 2

    analytics =
      callback: "setSearch"


    describe 'Object', ->

      it 'is defined', ->
        expect(Controller).toBeDefined()

      it 'has a state object', ->
        expect(Controller::state).toBeDefined()


    describe 'initialisation', ->
      beforeEach ->
        window.controller = new Controller()
        spyOn(controller, "_generateState")
        controller.popStateFired = false;
        controller.init()

      it 'calls generateState with the current url', ->
        expect(controller._generateState).toHaveBeenCalled()


    describe 'initialisation without support for history.pushState', ->
      beforeEach ->
        window.controller = new Controller()
        spyOn(controller, "_supportsHistory").andReturn(false)
        spyOn(controller, "_onHashChange")
        controller.popStateFired = false;
        controller.init()

      it 'calls _onHashChange', ->
        $(window).trigger('hashchange')
        expect(controller._onHashChange).toHaveBeenCalled()



    # --------------------------------------------------------------------------
    # Private Methods
    # --------------------------------------------------------------------------

    describe 'generating application state', ->
      beforeEach ->
        window.controller = new Controller()
        spyOn(controller, "getParams").andReturn(serialized.urlParams)

      it 'updates the application state object with the search parameters', ->
        controller._generateState()
        expect(controller.state).toEqual(deserialized)


    describe 'updating application state', ->
      beforeEach ->
        window.controller = new Controller()
        spyOn(controller, "getParams").andReturn(serialized.newUrlWithSearchAndFilters)
        controller._generateState()

      it 'creates a new application state', ->
        controller._updateState(newParams)
        expect(controller.state.filters["property_type"]["4star"]).toBe(true)


    describe 'creating the url', ->
      beforeEach ->
        window.controller = new Controller()
        spyOn(controller, "getParams").andReturn(serialized.newUrlWithSearchAndFilters)
        spyOn(controller, "getDocumentRoot").andReturn("/")
        controller._generateState()

      describe 'with pushState support', ->
        it 'serializes the application state with the document root', ->

          newUrl = controller._createUrl()
          expect(newUrl).toBe("/?" + serialized.newUrlWithSearchAndFilters)

        it 'serializes the application state with the *new* document root', ->

          newUrl = controller._createUrl("/reviewed")
          expect(newUrl).toBe("/reviewed?" + serialized.newUrlWithSearchAndFilters)

      describe 'without pushState support', ->
        beforeEach ->
          spyOn(controller, "_supportsHistory").andReturn(false)

        it 'creates a hashbang url with the document root', ->
          newUrl = controller._createUrl()
          expect(newUrl).toBe("#!/" + "?" + serialized.newUrlWithSearchAndFilters)

        it 'creates a hashbang url with the *new* document root', ->
          newUrl = controller._createUrl("/reviewed")
          expect(newUrl).toBe("#!/reviewed" + "?" + serialized.newUrlWithSearchAndFilters)


    describe 'creating the request url', ->
      beforeEach ->
        window.controller = new Controller()
        spyOn(controller, "_serializeState").andReturn(serialized.newUrlWithSearchAndFilters)
        spyOn(controller, "getDocumentRoot").andReturn("/foo")

      it 'serializes the application state with the document root and appends .json', ->
        newUrl = controller._createRequestUrl()
        expect(newUrl).toBe("/foo.json?" + serialized.newUrlWithSearchAndFilters)

      it 'serializes the application state with the *new* document root and appends .json', ->
        newUrl = controller._createRequestUrl("/bar")
        expect(newUrl).toBe("/bar.json?" + serialized.newUrlWithSearchAndFilters)


    describe 'updating the page offset', ->
      beforeEach ->
        window.controller = new Controller()
        controller.state = deserialized
        controller._updateOffset({page_offsets: 3})

      it 'should update the application state with the returned page offset', ->
        expect(controller.state.search.page_offsets).toBe(3)


    describe 'Remove the page param', ->
      beforeEach ->
        window.controller = new Controller()
        controller.state = appendParams
        controller._removePageParam()

      it 'params do not include page', ->
        expect(controller.state.page).toBe(undefined)


    describe 'updating push state', ->
      beforeEach ->
        spyOn(history, 'pushState');
        window.controller = new Controller()
        controller._navigate("/test")

      it 'history.pushState is called', ->
        expect(history.pushState).toHaveBeenCalledWith({}, null, "/test")

      afterEach ->
        controller.popStateFired = false


    describe 'updating hash bang', ->
      beforeEach ->
        window.controller = new Controller()
        spyOn(controller, '_supportsHistory').andReturn(false)
        spyOn(controller, '_supportsHash').andReturn(true)
        spyOn(controller, 'setHash')
        controller.popStateFired = false
        controller._navigate("/test")

      afterEach ->
        window.location.hash = ""

      it 'the hash is appended to the url', ->
        expect(controller.setHash).toHaveBeenCalledWith('/test')


    describe 'when we dont support pushState', ->

      beforeEach ->
        window.controller = new Controller()
        spyOn(controller, '_supportsHistory').andReturn(false)

      describe 'when we have a hash', ->
        beforeEach ->
          spyOn(controller, 'getHash').andReturn("#!/testing")
          spyOn(controller, 'setUrl')

        describe 'and history navigation is enabled', ->
          beforeEach ->
            controller.allowHistoryNav = true
            controller._onHashChange()

          it 'replaces the url with the stored hash url', ->
            expect(controller.setUrl).toHaveBeenCalledWith('/testing')

        describe 'and history navigation is disabled', ->
          beforeEach ->
            controller.allowHistoryNav = false
            controller._onHashChange()

          it 'does not update the url', ->
            expect(controller.getHash).not.toHaveBeenCalled()
            expect(controller.setUrl).not.toHaveBeenCalled()

      describe 'when we dont have a hash and history navigation is enabled', ->
        beforeEach ->
          spyOn(controller, 'getHash').andReturn("")
          spyOn(controller, 'getUrl').andReturn("www.lonelyplanet.com/testing")
          spyOn(controller, 'setUrl')
          controller.allowHistoryNav = true
          controller._onHashChange()

        it 'replaces the url with the current url', ->
          expect(controller.setUrl).toHaveBeenCalledWith('www.lonelyplanet.com/testing')


    describe 'calling the server', ->
      beforeEach ->
        window.controller = new Controller()
        spyOn($, "ajax")
        controller._callServer("http://www.lonelyplanet.com/foo.json?foo=bar", "foo")

      it 'enters the ajax function', ->
        expect($.ajax).toHaveBeenCalled()


    # --------------------------------------------------------------------------
    # Back / Forward
    # --------------------------------------------------------------------------

    describe 'on first load', ->
      beforeEach ->
        window.controller = new Controller()
        spyOn(controller, "setUrl")
        controller.popStateFired = false;
        controller._handlePopState()

      it 'does not refresh the page', ->
        expect(controller.setUrl).not.toHaveBeenCalled()

      afterEach ->
        controller.popStateFired = false


    describe 'after first load', ->
      beforeEach ->
        window.controller = new Controller()
        spyOn(controller, "getUrl").andReturn("http://www.lonelyplanet.com/england/london?search=foo")
        spyOn(controller, "setUrl")
        controller.popStateFired = false;
        controller.currentUrl = "http://www.lonelyplanet.com/england/london"
        controller._handlePopState()

      it 'refreshes the page', ->
        expect(controller.setUrl).toHaveBeenCalled()


    describe 'returning to the first page', ->
      beforeEach ->
        window.controller = new Controller()
        spyOn(controller, "getUrl").andReturn("http://www.lonelyplanet.com/england/london")
        spyOn(controller, "setUrl")
        controller.popStateFired = true;
        controller.currentUrl = "http://www.lonelyplanet.com/england/london"
        controller._handlePopState()

      it 'refreshes the page', ->
        expect(controller.setUrl).toHaveBeenCalled()


    # --------------------------------------------------------------------------
    # Events API
    # --------------------------------------------------------------------------

    describe 'on cards request', ->
      beforeEach ->
        loadFixtures('controller.html')
        window.controller = new Controller()
        spyOn(controller, "_callServer")
        spyOn(controller, "_createRequestUrl").andReturn("http://www.lonelyplanet.com/foo.json?foo=bar")
        $(LISTENER).trigger(':cards/request', newParams, analytics)

      it 'updates the internal state', ->
        expect(controller.state.filters).toBe(newParams.filters)

      it 'requests data from the server', ->
        expect(controller._callServer).toHaveBeenCalledWith("http://www.lonelyplanet.com/foo.json?foo=bar", controller.replace, controller.analytics)


    describe 'on cards append request', ->
      beforeEach ->
        loadFixtures('controller.html')
        window.controller = new Controller()
        spyOn(controller, "_callServer")
        spyOn(controller, "_createRequestUrl").andReturn("http://www.lonelyplanet.com/foo.json?foo=bar")
        $(LISTENER).trigger(':cards/append', {page: 2}, analytics)

      it 'updates the internal state', ->
        expect(controller.state.page).toBe(2)

      it 'requests data from the server', ->
        expect(controller._callServer).toHaveBeenCalledWith("http://www.lonelyplanet.com/foo.json?foo=bar", controller.append, controller.analytics)


    describe 'on page request', ->
      beforeEach ->
        loadFixtures('controller.html')
        window.controller = new Controller()
        spyOn(controller, "_callServer")
        spyOn(controller, "_augmentDocumentRoot")
        $(LISTENER).trigger(':page/request', "pageParams")

    describe 'when the server returns data', ->
      beforeEach ->
        loadFixtures('controller.html')
        window.controller = new Controller()
        spyEvent = spyOnEvent(controller.$el, ':cards/received');
        spyOn(controller, "_createUrl").andReturn('foo')
        spyOn(controller, "_navigate")
        spyOn(controller, "_updateOffset")
        controller.replace(newParams)

      it 'updates the page offset', ->
        expect(controller._updateOffset).toHaveBeenCalledWith(newParams.pagination)

      it 'updates the push state', ->
        expect(controller._navigate).toHaveBeenCalledWith('foo')

      it 'triggers the cards/received event', ->
        expect(':cards/received').toHaveBeenTriggeredOnAndWith(controller.$el, newParams)


    describe 'when the server returns data and there is no support for pushState', ->
      beforeEach ->
        loadFixtures('controller.html')
        window.controller = new Controller()
        spyEvent = spyOnEvent(controller.$el, ':cards/received');
        spyOn(controller, "_supportsHistory").andReturn(false)
        spyOn(controller, "_supportsHash").andReturn(true)
        spyOn(controller, "_createUrl").andReturn('foo')
        spyOn(controller, "_navigate")
        controller.replace(newParams)

      it 'updates the hashbang', ->
        expect(controller._navigate).toHaveBeenCalledWith('foo')

      it 'trigger the cards/received event', ->
        expect(':cards/received').toHaveBeenTriggeredOnAndWith(controller.$el, newParams)
