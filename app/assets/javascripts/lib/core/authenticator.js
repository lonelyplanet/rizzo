// ------------------------------------------------------------------------------
//
// Authenticator
//
// This script handles checking whether the user is signed in and generating
// the sign in/join links OR profile pic with sub menu (along with the right hand
// nav that appears on mobile).
//
// ------------------------------------------------------------------------------

define([ "jquery", "lib/utils/template" ], function($, Template) {
  "use strict";

  var Authenticator = function() {
    this.statusUrl = "https://auth.lonelyplanet.com/users/status.json";

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

    // Remove any previously generated user navigation.
    $(".js-user-signed-in, .js-user-signed-out").remove();
    _this.templateContainer.after($rendered);

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
