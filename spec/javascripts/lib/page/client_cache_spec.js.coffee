require ['public/assets/javascripts/lib/page/client_cache.js'], (ClientCache) ->

  describe 'ClientCache', ->

    describe 'Object', ->
      it 'is defined', ->
        expect(ClientCache).toBeDefined()

    describe 'Initialisation', ->
      beforeEach ->
        window.clientCache = new ClientCache()

      it 'creates a data store', ->
        expect(clientCache.cacheStore.length).toBe(0)

      it 'creates an expiry time', ->
        expect(clientCache.expiryTime).toBeDefined()

      it 'creates a max cache constraint', ->
        expect(clientCache.maxCacheSize).toBeDefined()

    describe "Cache API", ->
      beforeEach ->
        window.clientCache = new ClientCache()

      it 'is available', ->
        expect(clientCache.store).toBeDefined()
        expect(clientCache.fetch).toBeDefined()

      describe "Storing", ->
        beforeEach ->
          clientCache.store("/test", {content: "some test content"})

        it 'adds data to the cache store', ->
          expect(clientCache.cacheStore.pop()).toEqual({url: "/test", data: {content: "some test content"}, extras: {}})

      describe "Fetching", ->

        describe 'with a warm cache', ->
          beforeEach ->
            clientCache.cacheStore = [{url: "/test", data: {content: "some test content"}, extras: {}}, 1, 2]

          it 'fetches data to the cache store', ->
            cachedData = clientCache.fetch("/test")
            expect(cachedData).toEqual({url: "/test", data: {content: "some test content"}, extras: {}})

          it 'moves the returned entry to the top (newest) of the stack', ->
            cachedData = clientCache.fetch("/test")
            expect(clientCache.cacheStore).toEqual([1, 2, {url: "/test", data: {content: "some test content"}, extras: {}}])

        describe 'with an empty cache', ->
          beforeEach ->
            clientCache.cacheStore = []

          it 'returns null', ->
            cachedData = clientCache.fetch("/test")
            expect(cachedData).toEqual(null)

        describe 'with an expired cache', ->
          beforeEach ->
            clientCache.cacheStore = [{url: "/test", data: {content: "some test content"}, extras: {}}]
            spyOn(clientCache, "_isCacheAlive").andReturn(false)

          it 'fetches data to the cache store', ->
            cachedData = clientCache.fetch("/test")
            expect(cachedData).toEqual(null)


    describe "Cache expiry", ->
      beforeEach ->
        window.clientCache = new ClientCache()
        spyOn(clientCache, "_getCurrentTime").andReturn(12345)

      it 'returns an expired cache', ->
        clientCache.expiryTime = 12344
        expect(clientCache._isCacheAlive()).toBe(false)

      it 'returns a functional cache', ->
        clientCache.expiryTime = 12346
        expect(clientCache._isCacheAlive()).toBe(true)


    describe "Cache Size", ->
      beforeEach ->
        window.clientCache = new ClientCache()

      it 'has space', ->
        clientCache.cacheStore = [1,2]
        expect(clientCache._spaceInCache()).toBe(true)

      it 'is full', ->
        clientCache.cacheStore = [1,2,3]
        expect(clientCache._spaceInCache()).toBe(false)


    describe 'Creating a new entry', ->
      beforeEach ->
        window.clientCache = new ClientCache()

      describe 'When the cache has space', ->
        beforeEach ->
          spyOn(clientCache, "_spaceInCache").andReturn(true)
          clientCache.cacheStore = [1]
          clientCache.store("/bar", "new page")

        it 'adds the entry to the end of the cache', ->
          expect(clientCache.cacheStore[0]).toEqual(1)
          expect(clientCache.cacheStore[clientCache.cacheStore.length - 1]).toEqual({url: "/bar", data: "new page", extras: {}})

      describe 'When the cache is full', ->
        beforeEach ->
          spyOn(clientCache, "_spaceInCache").andReturn(false)
          clientCache.cacheStore = [1,2,3]
          clientCache.store("/bar", "new page")

        it 'adds the entry to the end of the cache', ->
          expect(clientCache.cacheStore[clientCache.cacheStore.length - 1]).toEqual({url: "/bar", data: "new page", extras: {}})

        it 'removes the oldest entry', ->
          expect(clientCache.cacheStore[0]).toEqual(2)
