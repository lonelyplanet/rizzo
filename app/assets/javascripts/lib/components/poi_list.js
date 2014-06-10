define([
  "jquery",
  "lib/components/poi_map",
  "lib/components/map_styles",
], function($, POIMap, MapStyles) {

  "use strict";

  var poiMap,
      poisMarkers = [],
      poisData = [],
      iterator;

  function POIList( args ) {
    var defaults = {
      poiMap: null,
      el: ".js-poi-list",
      pois: ".js-poi"
    };

    this.config = $.extend({}, defaults, args);

    if (!this.poiMap){
      poiMap = new POIMap();
      poiMap.$el.on(":map/open", this._build.bind(this));
    } else {
      this._build();
    }

  }

  POIList.prototype._build = function() {
    this.markerImages = {};

    if ( poiMap.$container.data().pois ){
      this._addPois();
    }

    this.$el = $(this.config.el);
    this.$pois = this.$el.find( this.config.pois );
    setTimeout(this._listen.bind(this), 200);

  };

  POIList.prototype._getIcon = function( topic, size ) {
    if (topic === "lodging"){
      topic = "hotel";
    }

    if (this.markerImages[topic + "-" + size]){
      return this.markerImages[topic + "-" + size];
    } else {
      return this.markerImages[topic + "-" + size] = this._createMarkerImage(topic, size);
    }
  };

  POIList.prototype._createMarkerImage = function(topic, size) {
    var markerStyle = MapStyles.markerStyles(topic, size);

    return {
      url: MapStyles.markerBackgroundImage,
      size: new window.google.maps.Size(markerStyle.size.width, markerStyle.size.height),
      origin: new window.google.maps.Point( -markerStyle.position.x, -markerStyle.position.y )
    };

  };

  POIList.prototype._addPois = function( event, pois ) {
    iterator = 0;
    poisData = pois || poiMap.$container.data().pois;

    for ( var i = 0, len = poisData.length; i < len; i++ ){
      setTimeout(this._createMarker.bind(this), 150);
    }
  };

  POIList.prototype._createMarker = function() {
    var marker = new window.google.maps.Marker({
      icon: this._getIcon( poisData[ iterator ].topic, "small" ),
      animation: window.google.maps.Animation.DROP,
      position: new window.google.maps.LatLng(
                  poisData[ iterator ]["location-latitude"],
                  poisData[ iterator ]["location-longitude"] ),
      map: poiMap.gmap
    });

    poisMarkers.push( marker );
    iterator += 1;
  };

  POIList.prototype._listen = function() {

    this.$pois.on("click", function(event) {
      this._selectPOI( $(event.target).closest("li").index() );
    }.bind(this));

    for (var i = 0, len = poisMarkers.length; i < len; i++){
      window.google.maps.event.addListener(poisMarkers[i], "click", this._selectPOI.bind(this, i));
    }

  };

  POIList.prototype._resetSelectedPOI = function() {
    this.$el.find(".is-selected").removeClass("is-selected");
    for (var i = 0, len = poisMarkers.length; i < len; i++){
      poisMarkers[ i ].setIcon(this._getIcon( poisData[ i ].topic, "small" ));
    }
  };

  POIList.prototype._selectPOI = function( poiIndex ) {
    var $poiItem = this.$el.find("[data-slug='" + poisData[ poiIndex ].slug + "']"),
        poiData = poisData[ poiIndex ],
        poiMarker = poisMarkers[ poiIndex ];

    this._resetSelectedPOI();

    $poiItem.addClass("is-selected");
    poiMarker.setIcon( this._getIcon( poiData.topic, "large" ) );
    poiMap.gmap.setCenter( poiMarker.getPosition() );
    poiMap.gmap.panBy( poiMap.$container.width() / 6, 0 );
  };

  return POIList;
});
