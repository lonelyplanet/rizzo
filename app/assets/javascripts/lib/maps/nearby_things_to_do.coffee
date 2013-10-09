# LP Nearby Things To Do
# Shows a list of nearby things to do
#
# Arguments:
#   args [Object]
#     target            : [string]  A container to append this widget to
#     pois              : [Object]  A hash of things to do category to the nearby top rated things to do in that category
#     listener          : [Object]  Object with poiSelected(poi_id) function - callback when a POI in the list is selected
#
# Dependencies:
#   Jquery
#
# Example:
#   var nearbyThingsToDo = new window.lp.NearbyThingsToDo(target: '#nearby_list', pois: pois);
#   nearbyThingsToDo.render()
#
#


define ['jquery', 'polyfills/scrollIntoViewIfNeeded'], ($) ->

  class NearbyThingsToDo

    constructor: (@args={})->
      @prepare()

    prepare: ->
      @container = $('<div>').addClass('nearby-pois')
      $(@args.target).append(@container)

    render: ->
      @container.empty()
      list = $('<ul>').addClass('nearby-pois__list')
      list.append(@renderPOI(activity)) for activity in @args.pois.sights_or_activities
      list.append(@renderPOI(@args.pois.entertainment)) if @args.pois.entertainment
      list.append(@renderPOI(@args.pois.restaurant)) if @args.pois.restaurant

      @container.append(list)
      @bindOnPOISelection()

    renderPOI: (activity) ->
      poi = activity.properties
      li = $('<li class="obj-list__item nearby-pois__poi icon--poi--'+activity.category+'" data-poi-id="'+poi.id+'" />')
      li.append('<a href="'+poi.uri+'" class="copy--h4">'+poi.title+'</a>')
      li.append('<div class="nearby-pois__poi__description">'+poi.description+'</div>')

    bindOnPOISelection: ->
      @container.find('li').on 'click', (e)=>
        poi_id = $(e.target).closest("li[data-poi-id]").attr('data-poi-id')
        @args.listener.poiSelected(poi_id) if (@args.listener? and poi_id?)

    highlightPOI: (poi_id)->
      @container.find('li[data-poi-id]').removeClass('nearby-pois__poi--highlighted')
      el = @container.find("li[data-poi-id=#{poi_id}]").addClass('nearby-pois__poi--highlighted')
      el[0].scrollIntoViewIfNeeded(true, true)

    resetPOIs: ->
      @container.find('li[data-poi-id]').removeClass('nearby-pois__poi--highlighted')
