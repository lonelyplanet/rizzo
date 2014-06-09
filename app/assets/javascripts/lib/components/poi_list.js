define([
  "jquery",
  "lib/components/poi_map",
  "lib/components/map_styles",
], function($, POIMap, MapStyles) {

  "use strict";

  var poiMap,
      poisMarkers = [];

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
    this._listen();

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

  POIList.prototype._addPois = function( e, pois ) {
    var iterator = 0,
        createMarker;
    pois = pois || poiMap.$container.data().pois;

    createMarker = function() {
      poisMarkers.push( new window.google.maps.Marker({
        icon: this._getIcon(pois[ iterator ].topic, "small"),
        animation: window.google.maps.Animation.DROP,
        position: new window.google.maps.LatLng( pois[iterator]["location-latitude"], pois[iterator]["location-longitude"] ),
        map: poiMap.gmap
      }));
      iterator += 1;
    }.bind(this);

    for ( var i = 0; i < pois.length; i++ ){
      setTimeout(createMarker, (i + 1) + 150);
    }
  };

  POIList.prototype._listen = function() {
    this.$pois.on("click", this._selectPOI.bind(this));
  };

  POIList.prototype._selectPOI = function( event ) {
    var index = $(event.target).closest("li").index();
    poiMap.gmap.setCenter( poisMarkers[ index ].getPosition() );
    poiMap.gmap.panBy( poiMap.$container.width() / 6, 0 );
  };

  return POIList;
});
