// ------------------------------------------------------------------------------
//
// Authenticator
//
// This script handles checking whether the user is signed in and generating
// the sign in/join links OR profile pic with sub menu (along with the right hand
// nav that appears on mobile).
//
// ------------------------------------------------------------------------------

define([ "jquery", "lib/utils/template", "lib/core/user_feed" ], function($, Template, UserFeed) {
  "use strict";

  var Authenticator = function() {
    this.statusUrl = "https://www.lonelyplanet.com/thorntree/users/status";

    this.init();
  },
  _this;

  // -------------------------------------------------------------------------
  // Initialise
  // -------------------------------------------------------------------------
  Authenticator.prototype.init = function() {
    _this = this;

    if (!this.$template) {
      this.templateContainer = $("#js-user-nav-template");
      this.$template = $(this.templateContainer.html());
    }

    $.ajax({
      url: this.statusUrl,
      dataType: "jsonp",
      jsonpCallback: "lpUserStatusCallback",
      success: _this._updateStatus,
      error: _this._updateStatus
    });
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  Authenticator.prototype._createUserLinks = function() {
    var template = _this.$template.filter(".js-user-signed-out-template").html();

    // Remove any previously generated user navigation.
    $(".js-user-signed-in, .js-user-signed-out").remove();
    _this.templateContainer.after(template);
  };

  Authenticator.prototype._createUserMenu = function() {
    var template = _this.$template.filter(".js-user-signed-in-template").html(),
        $rendered = $(Template.render(template, window.lp.user)),
        $userAvatar;


    if (window.lp.user.unreadMessageCount > 0) {
      $rendered.find(".js-responsive-unread-messages").removeClass("is-hidden");
    }

    // Remove any previously generated user navigation.
    $(".js-user-signed-in, .js-user-signed-out").remove();
    _this.templateContainer.after($rendered);

    // Initiate user feed component
    new UserFeed();

    $userAvatar = $(".js-user-avatar");
    $userAvatar.attr("src", $userAvatar.data("src"));
  };

  Authenticator.prototype._updateStatus = function(userStatus) {
    if (userStatus && userStatus.username) {
      window.lp.user = userStatus;
      _this._createUserMenu();
    } else {
      _this._createUserLinks();
    }
  };

  // Self instantiate
  new Authenticator();

  return Authenticator;

});
