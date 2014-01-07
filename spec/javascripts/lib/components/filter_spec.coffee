require ['public/assets/javascripts/lib/components/filter.js'], (Filter) ->

  describe 'Filter', ->

    LISTENER = '#js-card-holder'

    data =
      disable_price_filters: true
      external_filter: '5star,4star,3star,2star'

    data_alt =
      disable_price_filters: false

    describe 'Object', ->
      it 'is defined', ->
        expect(Filter).toBeDefined()

    describe 'Initialisation', ->
      beforeEach ->
        loadFixtures('filter.html')
        window.filter = new Filter({el: '#js-filters'})
        spyOn(filter, "_removeSEOLinks")
        filter.constructor({el: '#js-filters'})

      it 'removes the SEO links', ->
        expect(filter._removeSEOLinks).toHaveBeenCalledWith(filter.$el)


    describe 'When the parent element does not exist', ->
      beforeEach ->
        loadFixtures('filter.html')
        window.filter = new Filter({ el: '.foo'})
        spyOn(filter, "init")

      it 'does not initialise', ->
        expect(filter.init).not.toHaveBeenCalled()


    # --------------------------------------------------------------------------
    # Private Methods
    # --------------------------------------------------------------------------

    describe 'removing SEO links', ->
      beforeEach ->
        loadFixtures('filter.html')
        window.filter = new Filter({el: '#js-filters-seo'})

      it 'removes the links inside the labels', ->
        expect(filter.$el.find('.js-filter-label').children().length).toBe(0)

      it 'sets the label text to be the link text', ->
        expect(filter.$el.find('.js-filter-label').text()).toBe("5 star hotel")


    describe 'updating', ->
      beforeEach ->
        window.filter = new Filter({el: '#js-filters'})
        spyOn(filter, "_hideGroup")
        spyOn(filter, "_showGroup")
        spyOn(filter, "_enable")

      it 'hides the price filters given the correct params', ->
        filter._update({disable_price_filters: true})
        expect(filter._hideGroup).toHaveBeenCalledWith("price")

      it 'shows and enables the price filters given the correct params', ->
        filter._update({disable_price_filters: false})
        expect(filter._showGroup).toHaveBeenCalledWith("price")
        expect(filter._enable).toHaveBeenCalledWith("price")


    describe 'hiding filter groups', ->
      beforeEach ->
        loadFixtures('filter.html')
        window.filter = new Filter({el: '#js-filters'})
        filter._hideGroup('price')

      it 'it hides the price filters', ->
        expect(filter.$el.find(".js-price-filter")).toHaveClass('is-hidden')


    describe 'showing filter groups', ->
      beforeEach ->
        loadFixtures('filter.html')
        window.filter = new Filter({el: '#js-filters-disabled'})
        filter._showGroup('price')

      it 'it shows the price filters', ->
        expect(filter.$el.find(".js-price-filter")).not.toHaveClass('is-hidden')


    describe 'enabling filter groups', ->
      beforeEach ->
        loadFixtures('filter.html')
        window.filter = new Filter({el: '#js-filters-disabled'})
        filter._enable('price')

      it 'it enables the price filters', ->
        expect(filter.$el.find(".js-price-filter").find('input[type=checkbox][disabled]').length).toBe(0)


    describe 'adding active classes', ->
      beforeEach ->
        loadFixtures('filter.html')
        window.filter = new Filter({el: '#js-filters-change'})
        filter._toggleActiveClass("#test")

      it 'assigns the sibling label an active class', ->
        expect(filter.$el.find('input[type=checkbox]').siblings()).toHaveClass('is-active')


    describe 'removing active classes', ->
      beforeEach ->
        loadFixtures('filter.html')
        window.filter = new Filter({el: '#js-filters-active'})
        filter._toggleActiveClass("#test")

      it 'removes the sibling label active class', ->
        expect(filter.$el.find('input[type=checkbox]').siblings()).not.toHaveClass('is-active')


    describe 'setting filter values', ->
      external_filters = "5star,4star,3star,2star"

      beforeEach ->
        loadFixtures('filter.html')

      describe 'setting to true', ->
        beforeEach ->
          window.filter = new Filter({el: '#js-filters-external'})
          filter._set(external_filters, true)

        it 'checks the correct price filters', ->
          external_filter = external_filters.split(",")
          expect(filter.$el.find("input[name*='#{external_filter[0]}']").is(':checked')).toBe(true)
          expect(filter.$el.find("input[name*='#{external_filter[0]}']").siblings()).toHaveClass('is-active')
          expect(filter.$el.find("input[name*='#{external_filter[1]}']").is(':checked')).toBe(true)
          expect(filter.$el.find("input[name*='#{external_filter[1]}']").siblings()).toHaveClass('is-active')
          expect(filter.$el.find("input[name*='#{external_filter[2]}']").is(':checked')).toBe(true)
          expect(filter.$el.find("input[name*='#{external_filter[2]}']").siblings()).toHaveClass('is-active')
          expect(filter.$el.find("input[name*='#{external_filter[3]}']").is(':checked')).toBe(true)
          expect(filter.$el.find("input[name*='#{external_filter[3]}']").siblings()).toHaveClass('is-active')


      describe 'setting to false', ->

        beforeEach ->
          window.filter = new Filter({el: '#js-filters-reset'})
          filter._set(external_filters, false)

        it 'checks the correct price filters', ->
          external_filter = external_filters.split(",")
          expect(filter.$el.find("input[name*='#{external_filter[0]}']").is(':checked')).toBe(false)
          expect(filter.$el.find("input[name*='#{external_filter[0]}']").siblings()).not.toHaveClass('is-active')
          expect(filter.$el.find("input[name*='#{external_filter[1]}']").is(':checked')).toBe(false)
          expect(filter.$el.find("input[name*='#{external_filter[1]}']").siblings()).not.toHaveClass('is-active')
          expect(filter.$el.find("input[name*='#{external_filter[2]}']").is(':checked')).toBe(false)
          expect(filter.$el.find("input[name*='#{external_filter[2]}']").siblings()).not.toHaveClass('is-active')
          expect(filter.$el.find("input[name*='#{external_filter[3]}']").is(':checked')).toBe(false)
          expect(filter.$el.find("input[name*='#{external_filter[3]}']").siblings()).not.toHaveClass('is-active')


    describe 'resetting the filter', ->
      external_filter = ["5star","4star","3star","2star"]

      beforeEach ->
        window.filter = new Filter({el: '#js-filters-reset'})
        filter._reset()

      it 'checks the correct price filters', ->
        expect(filter.$el.find("input[name*='#{external_filter[0]}']").is(':checked')).toBe(false)
        expect(filter.$el.find("input[name*='#{external_filter[0]}']").siblings()).not.toHaveClass('is-active')
        expect(filter.$el.find("input[name*='#{external_filter[1]}']").is(':checked')).toBe(false)
        expect(filter.$el.find("input[name*='#{external_filter[1]}']").siblings()).not.toHaveClass('is-active')
        expect(filter.$el.find("input[name*='#{external_filter[2]}']").is(':checked')).toBe(false)
        expect(filter.$el.find("input[name*='#{external_filter[2]}']").siblings()).not.toHaveClass('is-active')
        expect(filter.$el.find("input[name*='#{external_filter[3]}']").is(':checked')).toBe(false)
        expect(filter.$el.find("input[name*='#{external_filter[3]}']").siblings()).not.toHaveClass('is-active')



    # --------------------------------------------------------------------------
    # Events API
    # --------------------------------------------------------------------------

    describe 'on page received', ->

      describe 'when passed a flag to disable price filters', ->

        beforeEach ->
          loadFixtures('filter.html')
          window.filter = new Filter({el: '#js-filters'})
          spyOn(filter, "_update")
          $(LISTENER).trigger(':page/received', "foo")

        it 'updates the filters', ->
          expect(filter._update).toHaveBeenCalledWith("foo")


    describe 'on filter reset', ->

      beforeEach ->
        loadFixtures('filter.html')
        window.filter = new Filter({el: '#js-filters-reset'})
        spyOn(filter, "_reset")
        $(LISTENER).trigger(':filter/reset')

      it 'the reset function', ->
        expect(filter._reset).toHaveBeenCalled()


    describe 'on filter input change', ->

      beforeEach ->
        loadFixtures('filter.html')
        window.filter = new Filter({el: '#js-filters-change'})
        spyOn(filter, "_toggleActiveClass")
        spyOn(filter, "_serialize")
        spyEvent = spyOnEvent(filter.$el, ':cards/request');
        element = filter.$el.find('input[type=checkbox]')
        element.trigger('change')

      it '_toggleActiveClass', ->
        expect(filter._toggleActiveClass).toHaveBeenCalled()

      it '_serialize', ->
        expect(filter._serialize).toHaveBeenCalled()

      it 'triggers the page request event', ->
        expect(':cards/request').toHaveBeenTriggeredOnAndWith(filter.$el, filter._serialize())


    describe 'when the user clicks a filter card', ->

      beforeEach ->
        loadFixtures('filter.html')
        window.filter = new Filter({el: '#js-filters'})
        spyOn(filter, "_set")
        spyEvent = spyOnEvent(filter.$el, ':cards/request');

      it 'calls _set with the new filters', ->
        filterCard = $(LISTENER).find('.js-stack-card-filter')
        filters = filterCard.data('filter')
        filterCard.trigger('click')
        expect(filter._set).toHaveBeenCalledWith(filters, true)

      it 'triggers the :cards/request event with the correct params', ->
        filterCard = $(LISTENER).find('.js-stack-card-filter')
        filterCard.trigger('click')
        expect(':cards/request').toHaveBeenTriggeredOn(filter.$el)

