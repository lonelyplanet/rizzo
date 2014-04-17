require ['public/assets/javascripts/lib/components/stack_intro.js'], (StackIntro) ->

  describe 'StackIntro', ->

    LISTENER = '#js-card-holder'

    describe 'Object', ->

      it 'is defined', ->
        expect(StackIntro).toBeDefined()

    describe 'default instance', ->

      beforeEach ->
        loadFixtures('stack_intro.html')
        @stackIntro = new StackIntro({el: '.js-stack-intro'})

      it 'has default configuration', ->
        args =
          el: '.js-stack-intro'
          title: '.js-copy-title'
          lead: '.js-copy-lead'
        expect(@stackIntro.config).toEqual(args)

      it 'extends base configuration', ->
        customArgs =
          el: '.foo-intro'
          title: '.foo-title'
          lead: '.foo-lead'
        customIntro = new StackIntro(customArgs)
        expect(customIntro.config).toEqual(customArgs)


    describe 'When the parent element does not exist', ->
      beforeEach ->
        loadFixtures('stack_intro.html')
        window.stackIntro = new StackIntro({ el: '.foo'})
        spyOn(stackIntro, "init")

      it 'does not initialise', ->
        expect(stackIntro.init).not.toHaveBeenCalled()


    # --------------------------------------------------------------------------
    # Private Methods
    # --------------------------------------------------------------------------

    describe 'updating', ->
      beforeEach ->
        loadFixtures('stack_intro.html')
        window.stackIntro = new StackIntro({el: '.js-stack-intro'})

      it 'updates intro title', ->
        title = 'City Of Goa'
        window.stackIntro._update({title: title})
        expect($("#{window.stackIntro.config.title}")).toHaveText(title)

      it 'updates lead paragraph', ->
        lead = 'Lorem ipsum dolor sit amet'
        window.stackIntro._update({lead: lead})
        expect($("#{window.stackIntro.config.lead}")).toHaveText(lead)


    describe 'content visibility', ->

      beforeEach ->
        loadFixtures('stack_intro.html')
        @stackIntro = new StackIntro({el: '.js-stack-intro'})

      it 'hides lead container', ->
        lead = ''
        @stackIntro._update({lead: lead})
        expect($("#{@stackIntro.config.lead}")).toHaveClass("is-hidden")

      it 'shows lead container', ->
        lead = 'Lorem ipsum dolor sit amet'
        @stackIntro._update({lead: lead})
        expect($("#{@stackIntro.config.lead}")).not.toHaveClass("is-hidden")


    # --------------------------------------------------------------------------
    # Events API
    # --------------------------------------------------------------------------

    data =
      copy:
        title: "Vietnam hotels and hostels"
        lead: "Some lead information about accommodation in Vietnam"
        description: "Some general information about accommodation in Vietnam"

    describe 'on received events', ->
      beforeEach ->
        loadFixtures('stack_intro.html')
        @stackIntro = new StackIntro({el: '.js-stack-intro'})
        spyOn(@stackIntro, "_update")

      it 'cards/received', ->
        $(LISTENER).trigger(':cards/received', data)
        expect(@stackIntro._update).toHaveBeenCalledWith(data.copy)

      it 'page/received', ->
        $(LISTENER).trigger(':page/received', data)
        expect(@stackIntro._update).toHaveBeenCalledWith(data.copy)
