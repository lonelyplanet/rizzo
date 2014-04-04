// ------------------------------------------------------------------------------
//
// Authenticator
//
// This script handles checking whether the user is signed on and generating
// the sign in/join links OR profile pic with sub menu (along with the right hand
// nav that appears on mobile).
//
// ------------------------------------------------------------------------------

define([ "jquery", "lib/utils/template" ], function($, Template) {
  "use strict";

  // @args = {}
  // el: {string} selector for parent element
  var Authenticator = function(args) {
    this.statusUrl = "https://www.lonelyplanet.com/thorntree/users/status";

    this.init();
  },
  _this;

  // -------------------------------------------------------------------------
  // Initialise
  // -------------------------------------------------------------------------
  Authenticator.prototype.init = function() {
    _this = this;

    $.ajax({
      url: this.statusUrl,
      dataType: "json",
      error: this._createLoginAndRegister,
      success: this._updateStatus
    });
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  Authenticator.prototype._getTemplate = function() {
    return $("#user-nav-template").html();
  };

  Authenticator.prototype._createLoginAndRegister = function() {
    var template = $(_this._getTemplate()).filter(".js-user-signed-out-template").html();

    $(".js-user-signed-in, .js-user-signed-out").remove();
    $("#user-nav-template").after(template);
  };

  Authenticator.prototype._createUserMenu = function() {
    var template = $(_this._getTemplate()).filter(".js-user-signed-in-template").html(),
        $rendered = $(Template.render(template, window.lp.user));

    if (window.lp.user.unreadMessageCount > 0) {
      $rendered.find(".js-unread-messages").removeClass("is-hidden");
    }

    $(".js-user-signed-in, .js-user-signed-out").remove();
    $("#user-nav-template").after($rendered);
  };

  Authenticator.prototype._updateStatus = function(userStatus) {
    if (userStatus && userStatus.username) {
      window.lp.user = userStatus;
      _this._createUserMenu();
    } else {
      _this._createLoginAndRegister();
    }
  };

  // Self instantiate
  new Authenticator();

  return Authenticator;

});
