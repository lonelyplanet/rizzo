require ['lib/analytics/analytics'], (Analytics) ->

  describe 'Analytics', ->

    stub = {
      test: 'one',
      test2: 'two'
    }

    beforeEach ->
      window.analytics = new Analytics()
      window.s.channel = "test"

    describe 'Object', ->
      it 'is defined', ->
        expect(Analytics).toBeDefined()


    describe 'adding', ->

      beforeEach ->
        analytics._add(stub)

      it 'adds a simple object to the onniture config', ->
        expect(analytics.config.test).toBe(stub.test)
        expect(analytics.config.test2).toBe(stub.test2)


    describe 'saving', ->

      beforeEach ->
        analytics.config = stub
        analytics._save()

      it 'saves the current state of the analytics config', ->
        expect(analytics.prevConfig.test).toBe(stub.test)
        expect(analytics.prevConfig.test2).toBe(stub.test2)


    describe 'copying', ->

      beforeEach ->
        analytics.config = stub
        analytics._copy()

      it 'copies the current config across to the window.s object', ->
        expect(window.s.test).toBe(stub.test)
        expect(window.s.test2).toBe(stub.test2)


    describe 'restoring', ->

      beforeEach ->
        analytics.prevConfig = {foo: "bar"}
        analytics.config = stub
        spyOn(analytics, "_copy")
        analytics._copy()
        analytics._restore()

      it 'removes the config variables from window.s', ->
        expect(window.s.test).not.toBeDefined()
        expect(window.s.test2).not.toBeDefined()

      it 'restores the values from prevConfig', ->
        expect(analytics.config.test).not.toBeDefined()
        expect(analytics.config.foo).toBe("bar")

      it 'copies the values back over to window.s', ->
        expect(analytics._copy).toHaveBeenCalled()


    describe 'trackLink', ->
      beforeEach ->
        spyOn(analytics, "_save")
        spyOn(analytics, "_add")
        spyOn(analytics, "_copy")
        spyOn(analytics, "_restore")
        spyOn(window.s, "tl")
        analytics.trackLink(stub)

      it 'saves the current config', ->
        expect(analytics._save).toHaveBeenCalled()

      it 'adds the new params', ->
        expect(analytics._add).toHaveBeenCalledWith(stub)

      it 'copies across the new params', ->
        expect(analytics._copy).toHaveBeenCalled()

      it 'sends the data to analytics', ->
        expect(window.s.tl).toHaveBeenCalled()

      it 'restores the old params', ->
        expect(analytics._restore).toHaveBeenCalled()


    describe 'tracking', ->
      beforeEach ->
        spyOn(analytics, "_save")
        spyOn(analytics, "_add")
        spyOn(analytics, "_copy")
        spyOn(analytics, "_restore")
        spyOn(window.s, "t")

      describe 'when restore is true', ->
        beforeEach ->
          analytics.track(stub, true)

        it 'saves the current config', ->
          expect(analytics._save).toHaveBeenCalled()

        it 'adds the new params', ->
          expect(analytics._add).toHaveBeenCalledWith(stub)

        it 'copies across the new params', ->
          expect(analytics._copy).toHaveBeenCalled()

        it 'sends the data to analytics', ->
          expect(window.s.t).toHaveBeenCalled()

        it 'restores the old params', ->
          expect(analytics._restore).toHaveBeenCalled()

      describe 'when restore is false', ->
        beforeEach ->
          analytics.track(stub)

        it 'does not save the current config', ->
          expect(analytics._save).not.toHaveBeenCalled()

        it 'does not call restore', ->
          expect(analytics._restore).not.toHaveBeenCalled()

