require ['public/assets/javascripts/lib/components/stack_list.js'], (StackList) ->

  describe 'StackList', ->

    config =
      el: '#js-stack-list-aside',
      list: '.js-neighbourhood-item,.js-facet,.js-descendant-item,.js-stack-collection'

    describe 'Object', ->
      it 'is defined', ->
        expect(StackList).toBeDefined()


    describe 'Initialising', ->
      beforeEach ->
        loadFixtures('stack_list.html')
        window.stackList = new StackList(config)

      it 'has default options', ->
        expect(stackList.config).toBeDefined()


    describe 'Not initialising', ->
      beforeEach ->
        loadFixtures('stack_list.html')
        window.stackList = new StackList({ el: '.foo'})
        spyOn(stackList, "init")

      it 'When the parent element does not exist', ->
        expect(stackList.init).not.toHaveBeenCalled()


    describe 'when the user clicks on a stack', ->
      beforeEach ->
        loadFixtures('stack_list.html')
        window.stackList = new StackList(config)

      it 'triggers the page request event', ->
        element = stackList.$el.find('.js-neighbourhood-item')
        params = {url: element.attr('href')}
        spyEvent = spyOnEvent(stackList.$el, ':page/request');

        element.trigger('click')
        expect(':page/request').toHaveBeenTriggeredOnAndWith(stackList.$el, params)


      describe 'when the user clicks on a stack', ->
        beforeEach ->
          loadFixtures('stack_list.html')
          window.stackList = new StackList(config)

        it 'sets the nav item as current', ->
          element = $('.js-neighbourhood-item')
          stackList._select(element)
          expect(element).toHaveClass('is-active')
          expect($('.js-facet')).not.toHaveClass('is-active')
