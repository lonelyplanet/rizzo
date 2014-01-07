require ['lib/mobile/autocomplete_mobile'], (AutoComplete) ->

  describe 'AutoComplete', ->

    myAutoComplete = null

    DEFAULT_CONFIG =
      id: 'my_search',
      uri: '/search/'

    SEARCH_TERM = 'London'
    TEXT_NODE = 3
    EMPTY_RESULTS = []
    SEARCH_RESULTS = [
      {
        title: "London"
        uri: "/london"
        type: "place"
      }
      {
        title: "Paris"
        uri: "/paris"
        type: "hotel"
      }
      {
        title: "Newcastle"
        uri: "/australia/newcastle"
        type: "publication"
      }
    ]
    MAPPED_RESULTS = [
      {
        name: "London"
        location: "/london"
        category: "place"
      }
      {
        name: "Paris"
        location: "/paris"
        category: "hotel"
      }
      {
        name: "Newcastle"
        location: "/australia/newcastle"
        category: "publication"
      }
    ]
    RESULT_MAP =
      title: 'name',
      uri: 'location',
      type: 'category'

    describe 'Object', ->
      it 'is defined', ->
        expect(AutoComplete).toBeDefined()

    describe 'Initialisation', ->

      describe 'checking for required arguments', ->
        beforeEach ->
          loadFixtures 'autocomplete_mobile.html'
          spyOn(AutoComplete.prototype, "_init").andCallThrough()

        it 'should initialise if required arguments are supplied', ->
          myAutoComplete = new AutoComplete DEFAULT_CONFIG

          expect(AutoComplete.prototype._init).toHaveBeenCalledWith DEFAULT_CONFIG

        it 'should not initialise if required argument element ID is not supplied', ->
          myAutoComplete = new AutoComplete {uri: '/search'}

          expect(AutoComplete.prototype._init).not.toHaveBeenCalled()

        it 'should not initialise if required argument URI is not supplied', ->
          myAutoComplete = new AutoComplete {id: 'my_search'}

          expect(AutoComplete.prototype._init).not.toHaveBeenCalled()

      describe 'configuring the component', ->
        beforeEach ->
          loadFixtures 'autocomplete_mobile.html'

        it 'should return a config object updated with the passed keys', ->
          newConfig = {id: 'my_search', uri: '/findme', parent: '.somewhere'}

          myAutoComplete = new AutoComplete newConfig
          config = myAutoComplete.config

          expect(config.id).toBe newConfig.id
          expect(config.uri).toBe newConfig.uri
          expect(config.parent).toBe newConfig.parent

      describe 'setting up the component', ->
        beforeEach ->
          loadFixtures 'autocomplete_mobile.html'

        it 'should create the list element and add it as an object property', ->
          myAutoComplete = new AutoComplete DEFAULT_CONFIG

          expect(myAutoComplete.results).toBeDefined()
          expect(myAutoComplete.results.tagName).toBe 'UL'
          expect(myAutoComplete.results.childNodes.length).toBe 0
          expect(myAutoComplete.results.hovered).not.toBeDefined()
          expect($(myAutoComplete.results)).toHaveClass 'autocomplete__results'

        it 'should create the list element with the specified class name', ->
          newConfig = {id: 'my_search', uri: '/search', resultsClass: 'mysearch__results'}
          myAutoComplete = new AutoComplete newConfig

          expect(myAutoComplete.results).toBeDefined()
          expect($(myAutoComplete.results)).toHaveClass newConfig.resultsClass

        it 'should create the list element with the specified modifier name', ->
          newConfig = {id: 'my_search', uri: '/search', classModifier: 'my-search'}
          myAutoComplete = new AutoComplete newConfig

          expect(myAutoComplete.results).toBeDefined()
          expect($(myAutoComplete.results)).toHaveClass 'autocomplete__results'
          expect($(myAutoComplete.results)).toHaveClass "autocomplete__results--#{newConfig.classModifier}"

    describe 'the results list', ->
      beforeEach ->
        loadFixtures 'autocomplete_mobile.html'
        myAutoComplete = new AutoComplete DEFAULT_CONFIG

      it 'should add a list hovered property to the component when mouse is over results', ->
        testElt = document.createElement 'LI'

        myAutoComplete._resultsMouseOver(testElt)

        expect(myAutoComplete.results.hovered).toBe true

      it 'should remove a list hovered property from the component when mouse is removed from results', ->
        testElt = document.createElement 'LI'
        myAutoComplete._resultsMouseOver(testElt)
        myAutoComplete._resultsMouseOut()

        expect(myAutoComplete.results.hovered).toBe false

    describe 'updating the results list', ->

      describe 'performing a search', ->

        describe 'the search threshold', ->

          describe 'the default search threshold', ->
            beforeEach ->
              loadFixtures 'autocomplete_mobile.html'
              myAutoComplete = new AutoComplete DEFAULT_CONFIG
              spyOn myAutoComplete, '_makeRequest'

            it 'should perform a search if the threshold has been reached', ->
              minimumSearch = 'abc'
              myAutoComplete._searchFor minimumSearch

              expect(myAutoComplete._makeRequest).toHaveBeenCalledWith minimumSearch

            it 'should not perform a search if the threshold has not been reached', ->
              belowMinimumSearch = 'ab'
              myAutoComplete._searchFor belowMinimumSearch

              expect(myAutoComplete._makeRequest).not.toHaveBeenCalled()

          describe 'input callback', ->
            callbackSpy = null

            beforeEach ->
              loadFixtures 'autocomplete_mobile.html'
              callbackSpy = jasmine.createSpy()
              newConfig = {id: 'my_search', uri: '/search', inputCallback: callbackSpy}
              myAutoComplete = new AutoComplete newConfig
              spyOn myAutoComplete, '_makeRequest'

            it 'should execute a callback when text has been entered', ->
              minimumSearch = 'a'
              myAutoComplete._searchFor minimumSearch

              expect(callbackSpy).toHaveBeenCalled()
              expect(myAutoComplete._makeRequest).not.toHaveBeenCalled()

          describe 'configuring the search threshold', ->
            beforeEach ->
              loadFixtures 'autocomplete_mobile.html'
              newConfig = {id: 'my_search', uri: '/search', threshold: 5}
              myAutoComplete = new AutoComplete newConfig
              spyOn myAutoComplete, '_makeRequest'

            it 'should perfom a search if the configured threshold has been reached', ->
              minimumSearch = 'abcde'
              myAutoComplete._searchFor minimumSearch

              expect(myAutoComplete._makeRequest).toHaveBeenCalledWith minimumSearch

            it 'should not perfom a search if the configured threshold has not been reached', ->
              minimumSearch = 'abcd'
              myAutoComplete._searchFor minimumSearch

              expect(myAutoComplete._makeRequest).not.toHaveBeenCalled()

          describe 'searching for a term when results are displayed', ->
            beforeEach ->
              myAutoComplete = null
              loadFixtures 'autocomplete_mobile.html'
              newConfig = {id: 'my_search', uri: '/search', throttle: 0}
              console.log myAutoComplete
              myAutoComplete = new AutoComplete newConfig
              myAutoComplete._searchFor 'Lon'
              console.log myAutoComplete
              spyOn myAutoComplete, '_makeRequest'

            it 'should perfom a search if the threshold has been reached', ->
              console.log myAutoComplete
              minimumSearch = 'Lond'
              myAutoComplete._searchFor minimumSearch

              expect(myAutoComplete._makeRequest).toHaveBeenCalledWith minimumSearch

            it 'should not perfom a search if the threshold has been reached', ->
              minimumSearch = 'Lo'
              myAutoComplete._searchFor minimumSearch

              expect(myAutoComplete._makeRequest).not.toHaveBeenCalled()

            it 'should remove previous results if the threshold has not been reached', ->
              minimumSearch = 'Lo'
              spyOn myAutoComplete, '_removeResults'
              myAutoComplete.results.displayed = true
              myAutoComplete._searchFor minimumSearch

              expect(myAutoComplete._makeRequest).not.toHaveBeenCalled()
              expect(myAutoComplete._removeResults).toHaveBeenCalled()

        describe 'generating the search URI', ->

          describe 'generating the default search endpoint', ->
            beforeEach ->
              loadFixtures 'autocomplete_mobile.html'
              myAutoComplete = new AutoComplete DEFAULT_CONFIG

            it 'should generate the full URI for the search endpoint with the search term', ->
              searchTerm = 'London'
              generatedURI = myAutoComplete._generateURI searchTerm

              expect(generatedURI).toBe "#{DEFAULT_CONFIG.uri}#{searchTerm}"

            it 'should generate the full URI for the search endpoint with the search term and scope', ->
              searchTerm = 'London'
              scope = 'homepage'
              generatedURI = myAutoComplete._generateURI searchTerm, scope

              expect(generatedURI).toBe "#{DEFAULT_CONFIG.uri}#{searchTerm}?scope=#{scope}"

          describe 'configuring the search endpoint', ->
            newConfig = {id: 'my_search', uri: '/mySearch='}

            beforeEach ->
              loadFixtures 'autocomplete_mobile.html'
              myAutoComplete = new AutoComplete newConfig

            it 'should generate the full URI for the search endpoint with the search term', ->
              searchTerm = 'London'
              generatedURI = myAutoComplete._generateURI searchTerm

              expect(generatedURI).toBe "#{newConfig.uri}#{searchTerm}"

            it 'should generate the full URI for the search endpoint with the search term and scope', ->
              searchTerm = 'London'
              scope = 'homepage'
              generatedURI = myAutoComplete._generateURI searchTerm, scope

              expect(generatedURI).toBe "#{newConfig.uri}#{searchTerm}?scope=#{scope}"

        describe 'search throttling', ->
          beforeEach ->
            loadFixtures 'autocomplete_mobile.html'
            myAutoComplete = new AutoComplete DEFAULT_CONFIG
            myAutoComplete._searchFor 'Lon'
            spyOn myAutoComplete, '_makeRequest'

          it 'should not perfom a search if not enough time has passed between throttle period', ->
            minimumSearch = 'Lond'
            myAutoComplete._searchFor minimumSearch

            expect(myAutoComplete._makeRequest).not.toHaveBeenCalled()

      describe 'adding the results list to the page', ->
        beforeEach ->
          loadFixtures 'autocomplete_mobile.html'

        it 'should append the populated list to the page', ->
          myAutoComplete = new AutoComplete DEFAULT_CONFIG

          myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM

          expect($('.autocomplete__results').length).toBe 1

        it 'should execute a callback when displaying the results', ->
          callbackSpy = jasmine.createSpy()
          newConfig = {id: 'my_search', uri: '/search', showResultsCallback: callbackSpy}
          myAutoComplete = new AutoComplete newConfig
          myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM

          expect(callbackSpy).toHaveBeenCalled()

      describe 'selecting a list item', ->
        beforeEach ->
          loadFixtures 'autocomplete_mobile.html'

        it 'should execute a callback when selecting an item', ->
          callbackSpy = jasmine.createSpy()
          testingMap =
            title: 'title'
          newConfig = {id: 'my_search', uri: '/search', map: testingMap, selectCallback: callbackSpy}
          myAutoComplete = new AutoComplete newConfig
          myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM

          myAutoComplete._highlight('down')
          myAutoComplete._handleEnter()

          expect(callbackSpy).toHaveBeenCalled()

      describe 'removing the results list from the page', ->
        beforeEach ->
          loadFixtures 'autocomplete_mobile.html'

        it 'should remove the results list from the page', ->
          myAutoComplete = new AutoComplete DEFAULT_CONFIG

          myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM
          myAutoComplete._removeResults()

          expect($('.autocomplete__results').length).toBe 0

        it 'should remove the active class if configured', ->
          newConfig = {id: 'my_search', uri: '/search', parentElt: 'search_results'}
          myAutoComplete = new AutoComplete newConfig

          myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM
          myAutoComplete._removeResults()

          expect($("##{newConfig.parentElt}")).not.toHaveClass 'autocomplete__active'

        it 'should execute a callback when removing the results', ->
          callbackSpy = jasmine.createSpy()
          newConfig = {id: 'my_search', uri: '/search', removeResultsCallback: callbackSpy}
          myAutoComplete = new AutoComplete newConfig

          myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM
          myAutoComplete._removeResults()

          expect(callbackSpy).toHaveBeenCalled()

      describe 'operating the list via keyboard', ->

        describe 'navigating the list via keyboard', ->
          beforeEach ->
            loadFixtures 'autocomplete_mobile.html'
            myAutoComplete = new AutoComplete DEFAULT_CONFIG
            myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM

          it 'highlights the first item in the list if none selected and down is pressed', ->
            myAutoComplete._highlight('down')

            expect(myAutoComplete.results.highlighted).toBe myAutoComplete.results.firstChild

          it 'highlights the last item in the list if none selected and up is pressed', ->
            myAutoComplete._highlight('up')

            expect(myAutoComplete.results.highlighted).toBe myAutoComplete.results.lastChild

          it 'highlights the next item in the list if item selected and down is pressed', ->
            myAutoComplete.results.highlighted = myAutoComplete.results.firstChild
            oldSelected = myAutoComplete.results.highlighted

            myAutoComplete._highlight('down')

            expect(myAutoComplete.results.highlighted).toBe oldSelected.nextSibling

          it 'highlights the previous item in the list if item selected and up is pressed', ->
            myAutoComplete.results.highlighted = myAutoComplete.results.lastChild
            oldSelected = myAutoComplete.results.highlighted

            myAutoComplete._highlight('up')

            expect(myAutoComplete.results.highlighted).toBe oldSelected.previousSibling

          it 'keeps the first item highlighted if first item selected and up is pressed', ->
            myAutoComplete.results.highlighted = myAutoComplete.results.firstChild
            oldSelected = myAutoComplete.results.highlighted

            myAutoComplete._highlight('up')

            expect(myAutoComplete.results.highlighted).toBe oldSelected

          it 'keeps the last item highlighted if last item selected and down is pressed', ->
            myAutoComplete.results.highlighted = myAutoComplete.results.lastChild
            oldSelected = myAutoComplete.results.highlighted

            myAutoComplete._highlight('down')

            expect(myAutoComplete.results.highlighted).toBe oldSelected

        describe 'selecting a list item via keyboard', ->
          beforeEach ->
            loadFixtures 'autocomplete_mobile.html'

          it 'should populate the input element with the selected basic list item contents', ->
            testingMap = 
              title: 'title'
            newConfig = {id: 'my_search', uri: '/search', map: testingMap}
            myAutoComplete = new AutoComplete newConfig
            myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM

            myAutoComplete._highlight('down')
            myAutoComplete._handleEnter()

            expect(myAutoComplete.el.value).toBe SEARCH_RESULTS[0].title

          it 'should navigate to the URL of the selected list item link', ->
            myAutoComplete = new AutoComplete DEFAULT_CONFIG
            myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM
            spyOn myAutoComplete, "_navigateTo"

            myAutoComplete._highlight('down')
            myAutoComplete._handleEnter()

            expect(myAutoComplete._navigateTo).toHaveBeenCalled()

      describe 'navigating the list via mouse', ->
        beforeEach ->
          loadFixtures 'autocomplete_mobile.html'
          myAutoComplete = new AutoComplete DEFAULT_CONFIG
          myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM

        it 'highlights a list item when hovered over', ->
          targetItem = myAutoComplete.results.childNodes[0]
          myAutoComplete._resultsMouseOver targetItem

          expect(myAutoComplete.results.highlighted).toBe targetItem
          expect(myAutoComplete.results.hovered).toBe true
          expect($(targetItem)).toHaveClass 'autocomplete__current'

        it 'removes highlight from list item when no longer hovered over', ->
          targetItem = myAutoComplete.results.firstChild
          myAutoComplete._resultsMouseOver targetItem
          myAutoComplete._resultsMouseOut()

          expect(myAutoComplete.results.highlighted).toBe false
          expect(myAutoComplete.results.hovered).toBe false
          expect($(targetItem)).not.toHaveClass 'autocomplete__current'

        it 'selects a link list item when clicked', ->
          fakeEvent =
            stopPropagation: jasmine.createSpy('stopPropagation'),
            target: $(myAutoComplete.results.firstChild).find('A')[0]

          myAutoComplete._resultsClick fakeEvent

          expect(fakeEvent.stopPropagation).toHaveBeenCalled()

        it 'selects a link list item when highlighted text is clicked', ->
          fakeEvent =
            stopPropagation: jasmine.createSpy('stopPropagation'),
            target: $(myAutoComplete.results.firstChild).find('B')[0]

          myAutoComplete._resultsClick fakeEvent

          expect(fakeEvent.stopPropagation).toHaveBeenCalled()

        it 'selects a basic list item when clicked', ->
          fakeEvent =
            stopPropagation: jasmine.createSpy('stopPropagation'),
            target: myAutoComplete.results.firstChild

          myAutoComplete._resultsClick fakeEvent

          expect(myAutoComplete.el.value).toBe fakeEvent.target.textContent

      describe 'populating the results list', ->
        beforeEach ->
          loadFixtures 'autocomplete_mobile.html'
          myAutoComplete = new AutoComplete DEFAULT_CONFIG

        describe 'adding items to an empty list', ->
          it 'should insert a list item for each result item into the results list element', ->
            expect(myAutoComplete.results.displayed).not.toBeDefined()

            myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM

            expect(myAutoComplete.results.displayed).toBe true

            results = myAutoComplete.results.childNodes
            expect(results.length).toBe SEARCH_RESULTS.length
            expect(results[0].textContent).toBe SEARCH_RESULTS[0].title
            expect(results[1].textContent).toBe SEARCH_RESULTS[1].title
            expect(results[2].textContent).toBe SEARCH_RESULTS[2].title

        describe 'adding items to a populated list', ->
          beforeEach ->
            myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM
            
          it 'should remove the previous results from the list', ->
            spyOn myAutoComplete, '_emptyResults'
            myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM

            expect(myAutoComplete._emptyResults).toHaveBeenCalled()

          it 'should contain the new search results', ->
            newResults = [
              title: "Newcastle"
              uri: "/australia/newcastle"
              type: "publication"
            ]
            myAutoComplete._populateResults newResults, SEARCH_TERM

            results = myAutoComplete.results.childNodes

            expect(myAutoComplete.results.displayed).toBe true
            expect(results.length).toBe 1
            expect(results[0].textContent).toBe newResults[0].title

      describe 'limiting the number of results', ->
        newConfig = {id: 'my_search', uri: '/search', limit: 2}

        beforeEach ->
          loadFixtures 'autocomplete_mobile.html'
          myAutoComplete = new AutoComplete newConfig
          myAutoComplete._populateResults SEARCH_RESULTS, SEARCH_TERM
          
        it 'should limited the number of search items generated', ->
          results = myAutoComplete.results.childNodes

          expect(results.length).toBe 2
          expect(results[0].textContent).toBe SEARCH_RESULTS[0].title
          expect(results[1].textContent).toBe SEARCH_RESULTS[1].title

      describe 'generating a list item from a result item', ->
        item = null
        searchTerm = 'Lon'
  
        describe 'creating a text item', ->
          testingMap = 
            title: 'title'
    
          newConfig = {id: 'my_search', uri: '/search', map: testingMap}

          beforeEach ->
            loadFixtures 'autocomplete_mobile.html'
            myAutoComplete = new AutoComplete newConfig
            item = myAutoComplete._createListItem SEARCH_RESULTS[0], searchTerm

          it 'should return a list item containing the search results title', ->
            expect(item.tagName).toBe 'LI'
            expect(item.textContent).toBe SEARCH_RESULTS[0].title
            expect($(item)).toHaveClass 'autocomplete__result'

          it 'should highlight the search term', ->
            expect(item.tagName).toBe 'LI'
            expect(item.innerHTML).toBe '<b>Lon</b>don'
        
        describe 'creating a basic link item', ->
          testingMap = 
            title: 'title',
            uri: 'uri'
    
          newConfig = {id: 'my_search', uri: '/search', map: testingMap}
    
          beforeEach ->
            loadFixtures 'autocomplete_mobile.html'
            myAutoComplete = new AutoComplete newConfig
            item = myAutoComplete._createListItem SEARCH_RESULTS[0], searchTerm

          it 'should return a list item containing an anchor tag', ->
            expect(item.tagName).toBe 'LI'
            expect(item.textContent).toBe SEARCH_RESULTS[0].title

            anchor = item.childNodes[0]
            expect(anchor.tagName).toBe 'A'
            expect(anchor.getAttribute('href')).toBe SEARCH_RESULTS[0].uri
            expect(anchor.className).toBe 'autocomplete__result__link'

          it 'should contain an anchor tag containing the highlighted search term', ->
            anchor = item.childNodes[0]

            expect(anchor.tagName).toBe 'A'
            expect(anchor.innerHTML).toBe '<b>Lon</b>don'

        describe 'creating adding data attributes to a link item', ->
          testingMap = 
            title: 'title',
            data: ['uri', 'type']
    
          newConfig = {id: 'my_search', uri: '/search', map: testingMap}
    
          beforeEach ->
            loadFixtures 'autocomplete_mobile.html'
            myAutoComplete = new AutoComplete newConfig
            item = myAutoComplete._createListItem SEARCH_RESULTS[0], searchTerm

          it 'should return a basic list item with data attributes', ->
            expect(item.tagName).toBe 'LI'
            expect(item.textContent).toBe SEARCH_RESULTS[0].title

            expect(item.getAttribute('data-uri')).toBe SEARCH_RESULTS[0].uri
            expect(item.getAttribute('data-type')).toBe SEARCH_RESULTS[0].type

        describe 'creating a typed link item', ->
          testingMap = 
            title: 'title',
            uri: 'uri',
            type: 'type'
    
          newConfig = {id: 'my_search', uri: '/search', map: testingMap}
    
          beforeEach ->
            loadFixtures 'autocomplete_mobile.html'
            myAutoComplete = new AutoComplete newConfig
            item = myAutoComplete._createListItem SEARCH_RESULTS[0], searchTerm

          it 'should return a list item containing an anchor tag', ->
            expect(item.tagName).toBe 'LI'
            expect(item.textContent).toBe SEARCH_RESULTS[0].title

            anchor = item.childNodes[0]
            expect(anchor.tagName).toBe 'A'
            expect(anchor.getAttribute('href')).toBe SEARCH_RESULTS[0].uri
            expect($(anchor)).toHaveClass 'autocomplete__result__link'
            expect($(anchor)).toHaveClass 'autocomplete__result__typed'
            expect($(anchor)).toHaveClass "icon--#{SEARCH_RESULTS[0].type}--before"
            expect($(anchor)).toHaveClass 'icon--white--before'
   
          it 'should contain an anchor tag containing the highlighted search term', ->
            anchor = item.childNodes[0]

            expect(anchor.tagName).toBe 'A'
            expect(anchor.innerHTML).toBe '<b>Lon</b>don'

      describe 'highlighting the search term', ->
        beforeEach ->
          loadFixtures 'autocomplete_mobile.html'
          myAutoComplete = new AutoComplete DEFAULT_CONFIG

        it 'should highlight the search text at the start of a title', ->
          searchTerm = 'Lond'

          highlightedText = myAutoComplete._highlightText SEARCH_RESULTS[0].title, searchTerm
          expect(highlightedText).toBe '<b>Lond</b>on'

        it 'should highlight the search text at the end of a title', ->
          searchTerm = 'don'

          highlightedText = myAutoComplete._highlightText SEARCH_RESULTS[0].title, searchTerm
          expect(highlightedText).toBe 'Lon<b>don</b>'

        it 'should highlight the search text in the middle of a title', ->
          searchTerm = 'ond'

          highlightedText = myAutoComplete._highlightText SEARCH_RESULTS[0].title, searchTerm
          expect(highlightedText).toBe 'L<b>ond</b>on'

        it 'should highlight the search text if it exactly matches a title', ->
          searchTerm = 'London'

          highlightedText = myAutoComplete._highlightText SEARCH_RESULTS[0].title, searchTerm
          expect(highlightedText).toBe '<b>London</b>'

        it 'should highlight the search text multiple times', ->
          searchTerm = 'London'
          testTitle = 'Is London really as nice as London?'

          highlightedText = myAutoComplete._highlightText testTitle, searchTerm
          expect(highlightedText).toBe 'Is <b>London</b> really as nice as <b>London</b>?'

        it 'should not highlight anything if the search text is not found', ->
          searchTerm = 'London'

          highlightedText = myAutoComplete._highlightText SEARCH_RESULTS[1].title, searchTerm
          expect(highlightedText).toBe 'Paris'
