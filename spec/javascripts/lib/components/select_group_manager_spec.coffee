require ['public/assets/javascripts/lib/components/select_group_manager'], (SelectGroupManager) ->

  describe 'Select Group Manager', ->

    describe 'Select Group Manager object', ->
      it 'is defined', ->
        expect(SelectGroupManager).toBeDefined()

    describe 'initialization', ->
      beforeEach ->
        loadFixtures('select_group_manager.html')

      it 'binds events to the wrapping element', ->
        selectGroupManager = new SelectGroupManager()
        expect(selectGroupManager.selectContainers.length).toBe(1)

    describe 'visual', ->
      beforeEach ->
        loadFixtures('select_group_manager.html')
        new SelectGroupManager()

      it 'adds the selected class on focus', ->
        $('.js-select').trigger('focus')
        expect($('.js-select-overlay').hasClass('is-selected')).toBe(true)

      it 'adds the selected class on blur', ->
        $('.js-select').trigger('focus')
        expect($('.js-select-overlay').hasClass('is-selected')).toBe(true)

      it 'updates the label overlay on change', ->
        $('.js-select').val('bar').change()
        expect($('.js-select-overlay').html()).toBe('Bar')

    describe 'form submission', ->
      beforeEach ->
        loadFixtures('select_group_manager.html')
        window.submit = ->
        spyOn(window, "submit")

        $('.select-manager-form').on 'submit', window.submit
        $('.select-manager-form').on 'submit', (e)->
          e.preventDefault()
          false
        $('.js-select').data('form-submit', 'true')
        new SelectGroupManager()

        $('.js-select').val('bar').change()

      it 'submits the form', ->
        expect(window.submit).toHaveBeenCalled()
