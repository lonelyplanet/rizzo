//-----------------------------------------------------------------------------
//
// User Feed: Container
//
//-----------------------------------------------------------------------------

define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    context: "body",
    classes: {
      container: [
        "user-feed",
        "js-user-feed",
        "is-hidden"
      ],
      activities: [
        "user-feed__activities",
        "user-feed__list",
        "icon--pen--line--before",
        "js-user-feed__activities"
      ],
      messages: [
        "user-feed__messages",
        "user-feed__list",
        "icon--comment--line--before",
        "js-user-feed__messages"
      ],
      shroud: [
        "user-feed__shroud",
        "js-user-feed__shroud"
      ]
    }
  };

  function Container(args) {
    this.config = $.extend({}, defaults, args);

    this.$context = $(this.config.context);

    this.$context.length && this.init();
  }

  Container.prototype.init = function() {
    var classes = this.config.classes,
        $container = this._makeEl("div", classes.container),
        $activities = this._makeEl("ul", classes.activities),
        $messages = this._makeEl("ul", classes.messages),
        $shroud = this._makeEl("div", classes.shroud);

    $container.append($activities, $messages, $shroud);

    this.$el = $container.appendTo(this.$context);

    console.log("UserFeed appended", this.$el, this.$context); // jshint ignore:line
  };

  //---------------------------------------------------------------------------
  // Private functions
  //---------------------------------------------------------------------------

  Container.prototype._makeEl = function(nodeName, classesArray) {
    return $("<" + nodeName + ">").addClass(classesArray.join(" "));
  };

  return Container;
});
