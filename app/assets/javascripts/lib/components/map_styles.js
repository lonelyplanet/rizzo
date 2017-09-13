define([], function() {

  "use strict";

  var markerStyles = {
    dot: {
      size: {
        width: 8,
        height: 8
      },
      position: {
        x: -241,
        y: -109
      }
    },
    tiny: {
      size: {
        width: 15,
        height: 21
      },
      position: {
        sight: { x: -15, y: -103 },
        activity: { x: -60, y: -103 },
        entertainment: { x: -104, y: -103 },
        hotel: { x: -149, y: -103 },
        bar: { x: -194, y: -103 },
        restaurant: { x: -194, y: -103 },
        shopping: { x: -283, y: -103 },
        festival: { x: -328, y: -103 },
        transport: { x: -372, y: -103 },
        mark: { x: -417, y: -103 },
        tour: { x: -462, y: -103 },
        article: { x: -506, y: -103 },
        info: { x: -551, y: -103 }
      }
    },
    small: {
      size: {
        width: 24,
        height: 33
      },
      position: {
        sight: { x: -11, y: -62 },
        activity: { x: -56, y: -62 },
        entertainment: { x: -100, y: -62 },
        hotel: { x: -145, y: -62 },
        bar: { x: -189, y: -62 },
        restaurant: { x: -234, y: -62 },
        shopping: { x: -279, y: -62 },
        festival: { x: -323, y: -62 },
        transport: { x: -368, y: -62 },
        mark: { x: -413, y: -62 },
        tour: { x: -457, y: -62 },
        article: { x: -502, y: -62 },
        info: { x: -547, y: -62 }
      }
    },
    large: {
      size: {
        width: 33,
        height: 46
      },
      position: {
        sight: { x: -6, y: -5 },
        activity: { x: -51, y: -5 },
        entertainment: { x: -95, y: -5 },
        hotel: { x: -140, y: -5 },
        bar: { x: -185, y: -5 },
        restaurant: { x: -229, y: -5 },
        shopping: { x: -274, y: -5 },
        festival: { x: -319, y: -5 },
        transport: { x: -363, y: -5 },
        mark: { x: -408, y: -5 },
        tour: { x: -452, y: -5 },
        article: { x: -497, y: -5 },
        info: { x: -542, y: -5 }
      }
    }

  };

  return {
    mapStyles: [
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#cbdae7"
          }
        ]
      }, {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#ffffff"
          }
        ]
      }, {
        featureType: "road.arterial",
        elementType: "geometry.stroke",
        stylers: [
          {
            visibility: "off"
          }
        ]
      }, {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#ffffff"
          }
        ]
      }, {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#c8e6aa"
          }
        ]
      }, {
        featureType: "landscape.man_made",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#eff1f3"
          }
        ]
      }, {
        featureType: "road.local",
        elementType: "geometry.stroke",
        stylers: [
          {
            visibility: "off"
          }
        ]
      }, {
        featureType: "road.local",
        elementType: "labels",
        stylers: [
          {
            visibility: "off"
          }
        ]
      }, {
        featureType: "poi.school",
        elementType: "geometry",
        stylers: [
          {
            color: "#dfdad3"
          }
        ]
      }, {
        featureType: "poi.medical",
        elementType: "geometry",
        stylers: [
          {
            color: "#fa5e5b"
          }, {
            saturation: -44
          }, {
            lightness: 25
          }
        ]
      }, {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
          { color: "#ffc83f" },
          { lightness: 50 }
        ]
      }
    ],
    markerBackgroundImage: "https://assets.staticlp.com/assets/shared/map-markers.png",
    markerStyles: function( topic, size ) {
      if (size === "dot"){
        return markerStyles[size];
      } else {
        return {
          size: markerStyles[size].size,
          position: markerStyles[size].position[topic]
        };
      }
    }
  };
});
