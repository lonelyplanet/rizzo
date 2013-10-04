# LP Lodging Map 
# Shows a map with a lodging and optionally nearby things to do
#
# Arguments:
#   args [Object]
#     target            : [string]    A container to append this widget to
#     lodging           : [Object]    A hash of info about the lodging such as name and long/lat
#     longitude         : [number]    center of map
#     latitude          : [number]    center of map
#     zoom              : [number]    zoom of map
#     optimized         : [boolean]   google maps API optimized setting to use for markers
#     listener          : [Object]    object has a poiSelected(poi_id) function - called when a poi is selected
#
# Dependencies:
#   Jquery
#
# Example:
#   var lodgingMap = new window.lp.LodgingMap(
#     target: '#map_canvas',
#     lodging: window.lp.lodging,
#     longitude: window.lp.map.latitude,
#     latitude: window.lp.map.longitude,
#     zoom: window.lp.map.zoom
#   );
#   lodgingMap.render()
#
#
define ['jquery','lib/utils/css_helper', 'lib/maps/map_styles'], ($, CssHelper, mapStyles) ->
 
  class LodgingMap

    markerDelay = 0
    markerDelayReset = false
    topic = $(document.documentElement).data('topic')

    constructor: (@args={}) ->
      @prepare()
      @markerImageFor('sight', 'small')

    prepare: ->
      opts =
        zoom: @args.zoom
        center: new google.maps.LatLng(@args.latitude, @args.longitude)
        mapTypeId: google.maps.MapTypeId.ROADMAP

      if @args.minimalUI
        $.extend(opts,
          mapTypeControl: false,
          panControl: false
          streetViewControl: false
          zoomControlOptions:
            style: google.maps.ZoomControlStyle.SMALL
        )

      target = $(@args.target).get(0)
      @map = new google.maps.Map(target, opts)
      @map.setOptions(styles: mapStyles)

    setLodgingMarker: () ->
      locationTitle = if topic is 'lodging' then @args.title else 'Location'
      locationAddress = @args.lodgingLocation or lp.lodging.address[0] or ''
      infobox = new InfoBox
        alignBottom: true
        boxStyle:
          maxWidth: 350
          textOverflow: 'ellipsis'
          whiteSpace: 'nowrap'
          width: 'auto'
        closeBoxURL: ''
        content: "<div class='infobox--location'>
          <p class='section-title text-icon text-icon--address'>#{locationTitle}</p>
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
        icon: @markerImageFor('location-marker', 'dot')
        position: new google.maps.LatLng(@args.latitude, @args.longitude)
        map: @map
        title: @args.title
        optimized: @args.optimized
      infobox.open(@map, marker)

    drawNearbyPOI: (poi) ->
      opts =
        animation: google.maps.Animation.DROP
        position: new google.maps.LatLng(poi.geometry.coordinates[1], poi.geometry.coordinates[0])
        map: @map
        title: poi.properties.title
        description: poi.properties.description
        optimized: @args.optimized
        poi_id: poi.properties.id
        category: poi.category
        icon: @markerImageFor(poi.category)
      marker = new google.maps.Marker(opts)

    createMarkerImageFor: (category, size) ->
      cssInfo = CssHelper.propertiesFor(
        "icon-poi-#{category}-#{size} icon-poi-#{size}", [
          'background-position'
          'background-position-x'
          'background-position-y'
          'background-image'
          'height'
          'width'
        ]
      )
      url = CssHelper.extractUrl(cssInfo['background-image'])
      stripPx = CssHelper.stripPx
      width = stripPx(cssInfo['width'])
      height = stripPx(cssInfo['height'])

      # IE does not understand background-position
      if cssInfo['background-position'] is undefined
        x = stripPx(cssInfo['background-position-x'])
        y = stripPx(cssInfo['background-position-y'])
      else
        x = stripPx(cssInfo['background-position'].split(' ')[0])
        y = stripPx(cssInfo['background-position'].split(' ')[1])

      new google.maps.MarkerImage(
        url,
        new google.maps.Size(width, height),
        new google.maps.Point(-x, -y)
      )

    markerImageFor: (category, size='small')->
      @markerImages ?= {}
      key = "#{category}-#{size}"
      @markerImages[key] ?= @createMarkerImageFor(category, size)

    initMapPOIs: (data)->
      @markers ?= {}
      for poi in @flatten(data)
        # Need this `do` so that `poi` is scoped within the for loop.
        do (poi) =>
          @addPOI(poi)

    addPOI: (poi) ->
      setTimeout =>
        marker = @drawNearbyPOI(poi)
        @addClickListener(marker)
        @markers[poi.properties.id] = marker
      , markerDelay
      clearTimeout(markerDelayReset) if markerDelayReset
      markerDelayReset = setTimeout ->
        markerDelay = 0
      , 150
      markerDelay += 100

    flatten: (obj) ->
      flat = []
      for prop of obj
        if ($.isArray(obj[prop]))
          $.merge(flat, @flatten(obj[prop]))
        else
          flat.push(obj[prop])
      flat

    addClickListener: (marker) ->
      # own function so marker in closure
      google.maps.event.addListener marker, 'click', =>
        poi_id = marker.poi_id
        @args.listener?.poiSelected(poi_id)

    highlightPOI: (poi_id) ->
      for id, marker of @markers
        if id == poi_id
          marker.setIcon(@markerImageFor(marker.category, 'large'))
          @map.panTo(marker.getPosition())
        else
          marker.setIcon(@markerImageFor(marker.category))

    resetPOIs: ->
      marker.setIcon(@markerImageFor(marker.category)) for id, marker of @markers
      @map.panTo( new google.maps.LatLng(@args.latitude, @args.longitude))
