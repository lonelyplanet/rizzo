require ['public/assets/javascripts/lib/utils/toggle_active.js'], (ToggleActive) ->

  describe 'ToggleActive', ->

    describe 'Object', ->
      it 'is defined', ->
        expect(ToggleActive).toBeDefined()

    describe 'Initialisation', ->
      beforeEach ->
        loadFixtures('toggle_active.html')
        window.toggleActive = new ToggleActive()
        spyOn(window.toggleActive, "_updateClasses").andCallThrough()

      it 'Initially adds the is-not-active class', ->
        expect($('.foo')[0]).toHaveClass('is-not-active')

      it 'Toggles the is-active and is-not-active classes.', ->
        runs ->
          $('#normal').trigger('click')

        waitsFor ->
          window.toggleActive._updateClasses.calls.length == 1
        , 'Callback to be called', 100

        runs ->
          expect($('.foo')[0]).toHaveClass('is-active')
          expect($('.foo')[0]).not.toHaveClass('is-not-active')


      it 'Toggles a custom class.', ->
        runs ->
          $('#custom-class').trigger('click')

        waitsFor ->
          window.toggleActive._updateClasses.calls.length == 1
        , 'Callback to be called', 100

        runs ->
          expect($('.foo')[0]).toHaveClass('custom-class')

      it 'Toggles the is-active classes on both the clicked element and the target.', ->
        runs ->
          $('#both').trigger('click')

        waitsFor ->
          window.toggleActive._updateClasses.calls.length == 1
        , 'Callback to be called', 100

        runs ->
          expect($('#both')).toHaveClass('is-active')
          expect($('#both')).not.toHaveClass('is-not-active')

      it 'Prevents the default click event for anchor elements', ->
        e = $.Event('click')
        $('#is-cancellable').trigger(e)
        expect(e.isDefaultPrevented()).toBe(true)

      it 'Does not prevent the default click event for non-anchor elements', ->
        e = $.Event('click')
        $('#not-cancellable').trigger(e)
        expect(e.isDefaultPrevented()).not.toBe(true)

    describe 'works with events', ->
      beforeEach ->
        loadFixtures('toggle_active.html')
        window.toggleActive = new ToggleActive()
        spyOn(window.toggleActive, "_handleToggle").andCallThrough()
        spyEvent = spyOnEvent($('#evented'), ':toggleActive/click')

      it 'on click it triggers :toggleActive/click', ->
        $('#evented').trigger('click')
        expect(':toggleActive/click').toHaveBeenTriggeredOn($('#evented'))

      it 'on update', ->
        target = document.querySelector('#evented')
        beforeState = $('#evented').hasClass('is-active')
        $('#js-row--content').trigger(':toggleActive/update', target)
        expect($('#evented').hasClass('is-active')).not.toEqual(beforeState)
