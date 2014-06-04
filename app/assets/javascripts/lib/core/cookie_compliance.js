define([ "jquery" ], function($) {

  "use strict";

  function CookieCompliance() {
    this.cookieName = "cookie-compliance";
    this.$element = $(".js-cookie-compliance");
    this.init();
  }

  CookieCompliance.prototype.init = function() {
    var $element = this.$element;

    if (!this.mustShow()) { return; }

    $element.addClass("is-open").removeClass("is-closed");

    $element.on("click", ".js-close", function() {
      $element.removeClass("is-open").addClass("is-closed");
    });

    this.set();
  };

  CookieCompliance.prototype.mustShow = function() {
    this.inEurope() && !this.seen();
  };

  CookieCompliance.prototype.inEurope = function() {
    var currency = window.lp.getCookie("lpCurrency");
    return currency == "GBP" || currency == "EUR";
  };

  CookieCompliance.prototype.seen = function() {
    if (window.lp.supports.localStorage) {
      return localStorage.getItem(this.cookieName);
    } else {
      return window.lp.getCookie(this.cookieName);
    }
  };

  CookieCompliance.prototype.set = function() {
    if (window.lp.supports.localStorage) {
      localStorage.setItem(this.cookieName, true);
    } else {
      document.cookie += document.cookie.length ?  ";" :  "";
      document.cookie += this.cookieName + "=true";
    }
  };

  return CookieCompliance;

});
