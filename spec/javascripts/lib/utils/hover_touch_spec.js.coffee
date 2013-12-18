require ['jquery', 'public/assets/javascripts/lib/utils/hover_touch.js'], ($, HoverTouch) ->

  describe 'HoverTouch', ->

    beforeEach ->
      window.hover_touch = new HoverTouch()

    describe '.init()', ->

      it 'binds event listeners to scope', ->
        events = $._data(hover_touch.$scope.get(0), "events")
        expect($.isEmptyObject(events)).toBe(false)
        expect(events.touchstart).toBeDefined()

    describe '.teardown()', ->

      it 'removes event listeners from scope', ->

        $fixture = hover_touch.$scope = $('<div>').on('foo.hovertouch')

        hover_touch.teardown()

        events = $._data($fixture.get(0), "events")
        expect(events).toBe(undefined)

    describe '.activate()', ->

      it 'adds the active class to element and cancels the event on first touch', ->

        e = $.Event('touchstart')
        $fixture = $('<div>')

        hover_touch.activate(e, $fixture)

        expect(e.isDefaultPrevented()).toBe(true)
        expect($fixture.hasClass(hover_touch.config.className)).toBe(true)

      it 'removes the active class from previously active element on first touch', ->

        e = $.Event('touchstart')
        $fixture_old = $('<div>')
        $fixture_new = $('<div>')

        hover_touch.$current = $fixture_old.addClass(hover_touch.config.className)

        hover_touch.activate(e, $fixture_new)

        expect($fixture_old.hasClass(hover_touch.config.className)).toBe(false)

      it 'does not cancel the event on a second touch', ->

        e = $.Event('touchstart')
        $fixture = $('<div>').addClass(hover_touch.config.className)

        hover_touch.activate(e, $fixture)

        expect(e.isDefaultPrevented()).toBe(false)
