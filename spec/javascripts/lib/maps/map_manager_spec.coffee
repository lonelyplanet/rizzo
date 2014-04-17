require ['public/assets/javascripts/lib/maps/map_manager'], (MapManager) ->

  describe 'MapManager', ->

    window.lp.lodging = window.lp.lodging || {}
    window.lp.lodging.map = {}

    describe 'object', ->
      it 'is defined', ->
        expect(MapManager).toBeDefined()

    describe 'event based load:', ->
      beforeEach ->
        loadFixtures('map_manager.html')
        spyOn(MapManager, 'loadLib')
        window.mapEventConfig =
          centerTrigger: '.js-map-center-trigger'
          centerDelay: 500
          loadSelector:'.js-map-trigger'
          loadEventType: 'click'
          minimalUI: true

      it 'Doesn\'t load before the specified event.', ->
        window.mapManager = new MapManager(mapEventConfig)
        expect(MapManager.loadLib).not.toHaveBeenCalled()

      it 'Loads successfully after the specified event.', ->
        window.mapManager = new MapManager(mapEventConfig)
        $('.js-map-trigger').trigger('click')
        expect(MapManager.loadLib).toHaveBeenCalled()
