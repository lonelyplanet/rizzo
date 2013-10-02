require ['public/assets/javascripts/lib/components/load_more.js'], (LoadMore) ->

  describe 'Load More Button', ->

    LISTENER = '#js-card-holder'

    describe 'Object', ->
      it 'is defined', ->
        expect(LoadMore).toBeDefined()


    describe 'Initialisation', ->
      beforeEach ->
        loadFixtures('load_more.html')
        window.lm = new LoadMore({el: '.js-pagination'})
      
      it 'has default options', ->
        expect(lm.config).toBeDefined()


    describe 'When the parent element does not exist', ->
      beforeEach ->
        loadFixtures('load_more.html')
        window.lm = new LoadMore({ el: '.foo'})
        spyOn(lm, "init")

      it 'does not initialise', ->
        expect(lm.init).not.toHaveBeenCalled()


    # --------------------------------------------------------------------------
    # Initialisation
    # --------------------------------------------------------------------------

    describe 'Cleaning html pagination', ->
      beforeEach ->
        loadFixtures('load_more.html')

      it 'has pagination without js', ->
        expect($('.js-pagination')).toExist()

      describe 'Append load more button', ->
        beforeEach ->
          window.lm = new LoadMore({el: '.js-pagination'})

        it 'removes the pagination', ->
          expect($('.js-pagination').children().length).toBe(1)

        it 'appends the load more button', ->
          expect($('#js-load-more')).toExist()


    # --------------------------------------------------------------------------
    # Private Methods
    # --------------------------------------------------------------------------

    describe 'hiding', ->
      beforeEach ->
        loadFixtures('load_more.html')
        window.lm = new LoadMore({el: '.js-pagination', visible: false})

      it 'hides the pagination', ->
        expect(lm.$el).toHaveClass('is-hidden')


    describe 'reset', ->
      beforeEach ->
        loadFixtures('load_more.html')
        window.lm = new LoadMore({el: '.js-pagination'})
        lm.currentPage = 2
        lm._reset()

      it 'resets the current page', ->
        expect(lm.currentPage).toBe(1)


    describe 'blocking', ->
      beforeEach ->
        loadFixtures('load_more.html')
        window.lm = new LoadMore({el: '.js-pagination'})
        lm._block()

      it 'adds the disabled and loading classes', ->
        expect(lm.$btn).toHaveClass('loading is-disabled')

      it 'updates the loading text', ->
        expect(lm.$btn.text()).toBe(lm.config.idleTitle)


    describe 'unblocking', ->
      beforeEach ->
        loadFixtures('load_more.html')
        window.lm = new LoadMore({el: '.js-pagination'})
        lm.$btn.addClass('loading is-disabled').text("some text")
        lm._unblock()

      it 'adds the disabled and loading classes', ->
        expect(lm.$btn).not.toHaveClass('loading is-disabled')

      it 'updates the loading text', ->
        expect(lm.$btn.text()).toBe(lm.config.title)



    # --------------------------------------------------------------------------
    # Events API
    # --------------------------------------------------------------------------

    stub =
      pagination :
        total: 10
        current: 1

    stub_single =
      pagination:
        total: 0

    stub_final_page =
      pagination:
        total: 10
        current: 10

    stub_has_more =
      pagination:
        has_more: true
        total: 0

    describe 'on cards request', ->
      beforeEach ->
        loadFixtures('load_more.html')
        window.lm = new LoadMore({el: '.js-pagination'})
        spyOn(lm, "_reset")
        spyOn(lm, "_block")
        $(LISTENER).trigger(':cards/request')

      it 'resets the pagination', ->
        expect(lm._reset).toHaveBeenCalled()

      it 'disables the pagination', ->
        expect(lm._block).toHaveBeenCalled()


    describe 'on cards received', ->
      beforeEach ->
        loadFixtures('load_more.html')
        window.lm = new LoadMore({el: '.js-pagination'})
        spyOn(lm, "_unblock")
        spyOn(lm, "_show")
        spyOn(lm, "_hide")

      it 'enables the pagination', ->
        $(LISTENER).trigger(':cards/received', stub)
        expect(lm._unblock).toHaveBeenCalled()

      it 'shows the pagination', ->
        $(LISTENER).trigger(':cards/received', stub)
        expect(lm._show).toHaveBeenCalled()

      it 'hides the pagination if the total pages is 0', ->
        $(LISTENER).trigger(':cards/received', stub_single)
        expect(lm._hide).toHaveBeenCalled()

      it 'hides the pagination if we are on the final page', ->
        $(LISTENER).trigger(':cards/received', stub_final_page)
        expect(lm._hide).toHaveBeenCalled()

      it 'shows the pagination if has_more is true', ->
        $(LISTENER).trigger(':cards/received', stub_has_more)
        expect(lm._show).toHaveBeenCalled()


    describe 'on page received', ->
      beforeEach ->
        loadFixtures('load_more.html')
        window.lm = new LoadMore({el: '.js-pagination'})
        spyOn(lm, "_unblock")
        spyOn(lm, "_show")
        spyOn(lm, "_hide")

      it 'enables the pagination', ->
        $(LISTENER).trigger(':page/received', stub)
        expect(lm._unblock).toHaveBeenCalled()

      it 'shows the pagination', ->
        $(LISTENER).trigger(':page/received', stub)
        expect(lm._show).toHaveBeenCalled()

      it 'hides the pagination if the total pages is 0', ->
        $(LISTENER).trigger(':page/received', stub_single)
        expect(lm._hide).toHaveBeenCalled()

      it 'hides the pagination if we are on the final page', ->
        $(LISTENER).trigger(':page/received', stub_final_page)
        expect(lm._hide).toHaveBeenCalled()

    describe 'on page/append/received', ->
      beforeEach ->
        loadFixtures('load_more.html')
        window.lm = new LoadMore({el: '.js-pagination'})
        spyOn(lm, "_unblock")
        spyOn(lm, "_show")
        spyOn(lm, "_hide")

      it 'enables the pagination', ->
        $(LISTENER).trigger(':cards/append/received', stub)
        expect(lm._unblock).toHaveBeenCalled()

      it 'shows the pagination', ->
        $(LISTENER).trigger(':cards/append/received', stub)
        expect(lm._show).toHaveBeenCalled()

      it 'hides the pagination if the total pages is 0', ->
        $(LISTENER).trigger(':cards/append/received', stub_single)
        expect(lm._hide).toHaveBeenCalled()

      it 'hides the pagination if we are on the final page', ->
        $(LISTENER).trigger(':cards/append/received', stub_final_page)
        expect(lm._hide).toHaveBeenCalled()


    describe 'on click', ->
      beforeEach ->
        loadFixtures('load_more.html')
        window.lm = new LoadMore({el: '.js-pagination'})
        spyEvent = spyOnEvent(lm.$el, ':cards/append');
        spyOn(lm, "_block")
        spyOn(lm, "_serialize").andReturn("foo")
        lm.currentPage = 4
        lm.$btn.trigger('click')

      it 'updates the current page', ->
        expect(lm.currentPage).toBe(5)

      it 'disables the pagination', ->
        expect(lm._block).toHaveBeenCalled()

      it 'serializes the pagination', ->
        expect(lm._serialize).toHaveBeenCalled()

      it 'triggers the page/append event', ->
        expect(':cards/append').toHaveBeenTriggeredOnAndWith(lm.$el, "foo")

