# MapManager (lp.MapManager)
# A simple map manager to orchestrate the async load of the google map lib and initialize the lodging map.
#
# Arguments
# No need for arguments, however (and for now) it reads the latitude, longitude, title, zoom, ...
# from the lp.map object. For further details on this object run console.log(lp.map) on the
# browser inspector
#
# Example:
# It only loads the lib and instantiates the map if lp.map is defined
#
# if(lp.map){
#   self.mapWidget = new MapManager({});
# }
#

define ['jquery', 'lib/maps/map_styles', 'lib/utils/css_helper', 'polyfills/scrollIntoViewIfNeeded'], ($, mapStyles, cssHelper) ->

  class MapManager
    @version: '0.0.11'
    @apiKey: "AIzaSyBQxopw4OR08VaLVtHaY4XEXWk3dvLSj5k"
    @currentPOI: null
    @config:
      target: '#js-map-canvas'
    poiElements = $()
    @pins = {}
    topic = $(document.documentElement).data('topic')
    mapManager = this

    constructor: (config) ->
      $.extend MapManager.config, config

      if config and config.loadSelector
        $(config.loadSelector).one(config.loadEventType, MapManager.loadLib)
      else
        MapManager.loadLib()

      if config and config.centerTrigger
        $(document).on 'change', config.centerTrigger, =>
          map = MapManager.map

          overlay = new google.maps.OverlayView()
          overlay.draw = ->
          overlay.setMap map

          setTimeout ->
            oldCenter = map.getCenter()
            google.maps.event.trigger(map, "resize")
            newCenter = map.getCenter()

            projection = overlay.getProjection()
            oldCenterPoint = projection.fromLatLngToDivPixel(oldCenter)
            newCenterPoint = projection.fromLatLngToDivPixel(newCenter)

            # Move the y axis by the difference between the old and new center points.
            newCenterPoint.y -= newCenterPoint.y - oldCenterPoint.y
            map.panTo(projection.fromDivPixelToLatLng(newCenterPoint))
          , config.centerDelay || 0


    @loadLib: =>
      return if @map
      # pointer to google-maps callback, not possible inside the regular closure environment
      lp.MapManager = MapManager
      script = document.createElement('script')
      script.src = "http://maps.googleapis.com/maps/api/js?key=#{@apiKey}&sensor=false&callback=lp.MapManager.initMap"
      document.body.appendChild(script)

    @initMap: =>
      if not (lp and lp.lodging and lp.lodging.map) or lp.lodging.map.genericCoordinates
        return $(@config.target).removeClass('is-loading')
      @config = $.extend({listener: this}, lp.lodging.map, @config)
      @config.mapCanvas = $(@config.target)
      poiElements = @config.mapCanvas.parent().find('.js-poi')
      buildMap()
      setLocationMarker()
      addPins()
      poiElements.on('click', poiSelected)
      @config.mapCanvas.removeClass('is-loading')

    buildMap = () =>
      mapOptions =
        zoom: @config.zoom
        center: new google.maps.LatLng(@config.latitude, @config.longitude)
        mapTypeId: google.maps.MapTypeId.ROADMAP
      if @config.minimalUI
        $.extend(mapOptions,
          mapTypeControl: false,
          panControl: false,
          streetViewControl: false,
          zoomControlOptions:
            style: google.maps.ZoomControlStyle.SMALL
        )
      @map = new google.maps.Map(@config.mapCanvas.get(0), mapOptions)
      @map.setOptions(styles: mapStyles)

    # this needs to be down here so it isn't loaded until we have a google
    setLocationMarker = => require ['google-maps-infobox'], =>
      locationTitle = if topic is 'lodging' then @config.title else 'Location'
      locationAddress = @config.lodgingLocation or lp.lodging.address[0] or ''
      infobox = new InfoBox
        alignBottom: true
        boxStyle:
          maxWidth: 350
          textOverflow: 'ellipsis'
          whiteSpace: 'nowrap'
          width: 'auto'
        closeBoxURL: ''
        content: "<div class='infobox--location icon--tapered-arrow-down--after icon--white--after'>
          <p class='copy--h3 infobox__title text-icon icon--place--pin--before icon--lp-blue--before'>#{locationTitle}</p>
          <p class='copy--body'>
            #{locationAddress or ''}
            <span class='infobox__interesting-places'> &middot;
              <label class='infobox__link--interesting-places js-resizer' for='js-resize'>
                interesting places nearby
              </label>
            </span>
          </p></div>"
        disableAutoPan: true
        maxWidth: 350
        zIndex: 50

      marker = new google.maps.Marker
        icon: getIcon('location-marker', 'dot')
        position: new google.maps.LatLng(@config.latitude, @config.longitude)
        map: @map
        title: @config.title
        optimized: @config.optimized

      infobox.open(@map, marker)

    createMarkerImage = (topic, size) ->
      cssInfo = cssHelper.propertiesFor(
        "icon-poi-#{topic}-#{size} icon-poi-#{size}", [
          'background-position'
          'background-position-x'
          'background-position-y'
          'background-image'
          'height'
          'width'
        ]
      )

      url = cssHelper.extractUrl(cssInfo['background-image'])
      width = parseInt(cssInfo['width'])
      height = parseInt(cssInfo['height'])

      # browsers don't all agree on background position (ie, ff)
      if cssInfo['background-position'] is undefined
        x = parseInt(cssInfo['background-position-x'])
        y = parseInt(cssInfo['background-position-y'])
      else
        x = parseInt(cssInfo['background-position'].split(' ')[0])
        y = parseInt(cssInfo['background-position'].split(' ')[1])

      new google.maps.MarkerImage(
        url,
        new google.maps.Size(width, height),
        new google.maps.Point(-x, -y)
      )

    getIcon = (topic, size='small') =>
      @markerImages ?= {}
      topic = 'hotel' if topic is 'lodging'
      @markerImages[topic + '-' + size] ?= createMarkerImage(topic, size)

    mapMarker = (poi) =>
      new google.maps.Marker (
        animation:   google.maps.Animation.DROP
        position:    new google.maps.LatLng(poi.locationLatitude, poi.locationLongitude)
        map:         @map
        title:       poi.name
        description: poi.description
        optimized:   @config.optimized
        id:          poi.slug
        category:    poi.topic
        icon:        getIcon(poi.topic)
      )

    addPins = () =>
      markerDelay = 0
      poiElements.each (_, poi) =>
        poi = $(poi).data()
        setTimeout =>
          pin = mapMarker(poi)
          pin.set('targetMap', @config.mapCanvas)
          google.maps.event.addListener(pin, 'click', poiSelected)
          @pins[poi.slug] = pin
        , markerDelay
        clearTimeout(@timeout)
        @timeout = setTimeout ->
          markerDelay = 0
        , 150
        markerDelay += 100

    highlightPin = (id) =>
      for slug, pin of @pins
        if slug is id
          pin.setIcon(getIcon(pin.category, 'large'))
          @map.panTo(pin.getPosition())
        else
          pin.setIcon(getIcon(pin.category))

    resetPins = =>
      for slug, pin of @pins
        pin.setIcon(getIcon(pin.category))
      @map.panTo(new google.maps.LatLng(@config.latitude, @config.longitude))

    poiSelected = (obj) ->
      # so, this gets called by either the list item or the pin, which both have a different event attached
      # (but want the same result)
      # during testing, however, it gets called without an event.
      # in that case, 'this' is set to the google maps marker object
      # which is the only instance in which this could have a .id
      if @id
        id = @id
        map = @targetMap
      else
        # when called by pinclick, the Marker event will have an obj.Va (which is actually the event)
        # when called by list-item click, obj will be a normal event object
        targetElement = if obj.Va then $(obj.Va.target) else $(obj.target)
        id = @id or targetElement.closest('[data-slug]').data('slug')
        map = targetElement.closest('.map')
      highlightPois(id: id, map: map)

    highlightPois = ({id, map}) ->
      poiElements.removeClass('nearby-pois__poi--highlighted')

      $resizer = map.find('.js-resizer')
      resizeCheckbox = document.getElementById($resizer.attr('for'))

      if resizeCheckbox and not resizeCheckbox.checked
        $resizer.click()

      if id is mapManager.currentPOI
        mapManager.currentPOI = null
        map.removeClass('map--has-focus')
        resetPins();
      else
        mapManager.currentPOI = id
        map.addClass('map--has-focus')
        element = poiElements.filter("[data-slug='#{id}']").addClass('nearby-pois__poi--highlighted').get(0)
        element.scrollIntoViewIfNeeded(true, true)
        highlightPin(id)
