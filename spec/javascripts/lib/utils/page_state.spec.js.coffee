require ['public/assets/javascripts/lib/utils/page_state.js'], (PageState) ->

  describe 'PageState', ->

    pageState = new PageState()

    describe 'Object', ->
      it 'is defined', ->
        expect(PageState).toBeDefined()

    describe 'Has Filtered', ->

      describe 'by subpath', ->
        beforeEach ->
          spyOn(pageState, "withinFilterUrl").andReturn(true)

        it 'returns true for hasFiltered', ->
          expect(pageState.hasFiltered()).toBe(true)

      describe 'by querystring', ->
        beforeEach ->
          spyOn(pageState, "withinFilterUrl").andReturn(false)
          spyOn(pageState, "getParams").andReturn("/england/london/hotels?filters=foo")

        it 'returns true for hasFiltered', ->
          expect(pageState.hasFiltered()).toBe(true)

    describe 'Has not Filtered', ->

      describe 'by subpath', ->
        beforeEach ->
          spyOn(pageState, "withinFilterUrl").andReturn(false)

        it 'returns true for hasFiltered', ->
          expect(pageState.hasFiltered()).toBe(false)

      describe 'by querystring', ->
        beforeEach ->
          spyOn(pageState, "withinFilterUrl").andReturn(false)
          spyOn(pageState, "getParams").andReturn("/england/london/hotels?search=foo")

        it 'returns true for hasFiltered', ->
          expect(pageState.hasFiltered()).toBe(false)


    describe 'Has Searched', ->

      describe 'by querystring', ->
        beforeEach ->
          spyOn(pageState, "getParams").andReturn("/england/london/hotels?search=foo")

        it 'returns true for hasSearched', ->
          expect(pageState.hasSearched()).toBe(true)

      describe 'by querystring', ->
        beforeEach ->
          spyOn(pageState, "getParams").andReturn("/england/london/hotels?filters=foo")

        it 'returns true for hasSearched', ->
          expect(pageState.hasSearched()).toBe(false)


    describe 'Get Document Root', ->

      describe 'within a subcategory url', ->
        beforeEach ->
          spyOn(pageState, "withinFilterUrl").andReturn(true)

        it 'in hotels', ->
          expect(pageState.createDocumentRoot("/england/london/hotels/rated")).toBe("/england/london/hotels")
          expect(pageState.createDocumentRoot("/england/london/hotels/apartments")).toBe("/england/london/hotels")
          expect(pageState.createDocumentRoot("/england/london/hotels/5-star")).toBe("/england/london/hotels")

        it 'in things to do', ->
          expect(pageState.createDocumentRoot("/england/london/things-to-do/snowboarding")).toBe("/england/london/things-to-do")

      describe 'without a subcategory url', ->
        beforeEach ->
          spyOn(pageState, "withinFilterUrl").andReturn(false)

        it 'in hotels', ->
          expect(pageState.createDocumentRoot("/england/london/hotels/")).toBe("/england/london/hotels/")

        it 'in things to do', ->
          expect(pageState.createDocumentRoot("/england/london/things-to-do/")).toBe("/england/london/things-to-do/")
