define([ "jquery" ], function($) {

  "use strict";

  var CSSHelper = function() {};

  CSSHelper.propertiesFor = function(className, properties) {
    var element = $("<span>").addClass(className),
        extractedProperties = {},
        i = 0,
        length, property;

    element.hide().appendTo("body");

    for (i = 0, length = properties.length; i < length; i++) {
      property = properties[i];
      extractedProperties[property] = element.css(property);
    }

    element.remove();

    return extractedProperties;
  };

  CSSHelper.stripPx = function(size) {
    return size.substring(0, size.indexOf("px"));
  };

  CSSHelper.extractUrl = function(value) {
    var start = value.indexOf("url(") + 4,
      end = value.lastIndexOf(")");

    return value.substring(start, end).replace(/(^"|"$)/g, "");
  };

  return CSSHelper;
});
