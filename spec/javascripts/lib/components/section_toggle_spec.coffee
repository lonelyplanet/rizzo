require ['public/assets/javascripts/lib/components/section_toggle.js'], (SectionToggle) ->

  describe 'Section Toggle', ->

    describe 'Object', ->
      it 'is defined', ->
        expect(SectionToggle).toBeDefined()

    describe 'Initialising', ->
      beforeEach ->
        loadFixtures('section_toggle.html')
        spyOn(SectionToggle.prototype, "init")

      it 'has default options', ->
        window.SectionToggle = new SectionToggle()
        expect(window.SectionToggle.config).toBeDefined()

      it 'initialises when the parent element exists', ->
        window.SectionToggle = new SectionToggle()
        expect(window.SectionToggle.init).toHaveBeenCalled()

      it 'does not initialise if the parent element does not exist', ->
        window.SectionToggle = new SectionToggle({selector: '.my-missing-section'})
        expect(window.SectionToggle.init).not.toHaveBeenCalled()


    describe 'When the total height of the area is smaller than the max height', ->
      beforeEach ->
        loadFixtures('section_toggle.html')
        spyOn(SectionToggle.prototype, "getFullHeight").andReturn(50)
        spyOn(SectionToggle.prototype, "addHandler")
        spyOn(SectionToggle.prototype, "setWrapperState")
        window.SectionToggle = new SectionToggle({maxHeight: 100})

      it 'keeps the toggle area open and does not have a toggle button', ->
        expect(window.SectionToggle.addHandler).not.toHaveBeenCalled()
        expect(window.SectionToggle.setWrapperState).not.toHaveBeenCalled()
        expect(window.SectionToggle.$el).toHaveClass('is-open')
        expect(window.SectionToggle.$el.find('.btn--read-more').length).toBe(0)


    describe 'When the total height of the area is larger than the max height', ->
      beforeEach ->
        loadFixtures('section_toggle.html')
        spyOn(SectionToggle.prototype, "getFullHeight").andReturn(150)

      it 'appends a block-style toggle button by default', ->
        window.SectionToggle = new SectionToggle({maxHeight: 100})
        expect(window.SectionToggle.$el.find('.btn--clear').length).toBe(1)
        expect(window.SectionToggle.wrapper).toHaveClass('read-more-block')

      it 'appends a shadow block-style toggle button when requested', ->
        window.SectionToggle = new SectionToggle({maxHeight: 100, shadow: true})
        expect(window.SectionToggle.$el.find('.read-more__handler').length).toBe(1)
        expect(window.SectionToggle.$el.find('.btn--clear').length).toBe(1)
        expect(window.SectionToggle.wrapper).toHaveClass('read-more-block')

      it 'appends an inline-style toggle button when requested', ->
        window.SectionToggle = new SectionToggle({maxHeight: 100, style: 'inline'})
        expect(window.SectionToggle.$el.find('.btn--clear').length).toBe(1)
        expect(window.SectionToggle.wrapper).toHaveClass('read-more-inline')

      it 'closes toggle area by default', ->
        window.SectionToggle = new SectionToggle({maxHeight: 100})
        expect(window.SectionToggle.wrapper.css('maxHeight')).toEqual('100px')
        expect(window.SectionToggle.$el).toHaveClass('is-closed')
        expect(window.SectionToggle.handler.text()).toBe('Read more')


    describe 'When the Read more button is clicked while closed', ->
      beforeEach ->
        loadFixtures('section_toggle.html')
        spyOn(SectionToggle.prototype, "getFullHeight").andReturn(150)
        window.SectionToggle = new SectionToggle({maxHeight: 100})
        window.SectionToggle.transitionEnabled = false # to execute toggleClasses immediately
        window.SectionToggle.$el.find('.btn--clear').click()

      it 'opens the toggle area when the toggle button is clicked', ->
        expect(window.SectionToggle.$el).toHaveClass('is-open')
        expect(window.SectionToggle.wrapper.css('maxHeight')).toEqual('150px')
        expect(window.SectionToggle.handler.text()).toBe('Read less')


    describe 'When the Read more button is clicked while open', ->
      beforeEach ->
        loadFixtures('section_toggle.html')
        spyOn(SectionToggle.prototype, "getFullHeight").andReturn(150)
        window.SectionToggle = new SectionToggle({maxHeight: 100})
        window.SectionToggle.transitionEnabled = false # to execute toggleClasses immediately
        window.SectionToggle.$el.find('.btn--read-more').click()
        window.SectionToggle.$el.find('.btn--read-more').click()

      it 'opens the toggle area when the toggle button is clicked', ->
        expect(window.SectionToggle.$el).toHaveClass('is-closed')
        expect(window.SectionToggle.wrapper.css('maxHeight')).toEqual('100px')
        expect(window.SectionToggle.handler.text()).toBe('Read more')

    describe 'With tolerance', ->
      describe 'When the total height of the area is larger than the max height but within tolerance', ->
        beforeEach ->
          loadFixtures('section_toggle.html')
          spyOn(SectionToggle.prototype, "getFullHeight").andReturn(120)
          spyOn(SectionToggle.prototype, "addHandler")
          spyOn(SectionToggle.prototype, "setWrapperState")
          window.SectionToggle = new SectionToggle({maxHeight: 100, tolerance: 50})

        it 'keeps the toggle area open and does not have a toggle button', ->
          expect(window.SectionToggle.addHandler).not.toHaveBeenCalled()
          expect(window.SectionToggle.setWrapperState).toHaveBeenCalledWith({ height : 120, text : 'Read less', state : 'open', classes : 'icon--chevron-up--after'})
          expect(window.SectionToggle.$el).toHaveClass('is-open')
          expect(window.SectionToggle.$el.find('.btn--read-more').length).toBe(0)

      describe 'When the total height of the area is larger than the max height plus tolerance', ->
        beforeEach ->
          loadFixtures('section_toggle.html')
          spyOn(SectionToggle.prototype, "getFullHeight").andReturn(120)

        it 'appends a block-style toggle button by default', ->
          window.SectionToggle = new SectionToggle({maxHeight: 100, tolerance: 10})
          expect(window.SectionToggle.$el.find('.btn--clear').length).toBe(1)
          expect(window.SectionToggle.wrapper).toHaveClass('read-more-block')

        it 'closes toggle area by default', ->
          window.SectionToggle = new SectionToggle({maxHeight: 100, tolerance: 10})
          expect(window.SectionToggle.wrapper.css('maxHeight')).toEqual('100px')
          expect(window.SectionToggle.$el).toHaveClass('is-closed')
          expect(window.SectionToggle.handler.text()).toBe('Read more')
