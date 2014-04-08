// ------------------------------------------------------------------------------
//
// Template
//
// A temporary templating util until we have enough reason to include all of
// Hogan.js within Rizzo.
//
// Note: This will only work one level deep within the given object and has no
//       looping or conditional logic whatsoever.
//
// ------------------------------------------------------------------------------

define(function() {
  "use strict";

  var Template = function() {};

  // template: {string} The mustache-like template
  // obj: {object} The object to grab the data from
  Template.render = function(template, obj) {
    for (var key in obj) {
      template = template.replace(new RegExp("{{" + key + "}}", "gm"), obj[key]);
    }

    return template;
  };

  return Template;

});
