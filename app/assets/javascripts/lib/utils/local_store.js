// ----------------------------------------------------------
//
// LocalStore (util)
// Serialize key,value into localstorage with cookies fallback
// for browsers that don't support localstorage.
//
// ----------------------------------------------------------
define(function() {

  "use strict";

  var LocalStore = function() {};

  LocalStore.set = function(key, value) {
    if (window.lp.supports.localStorage) {
      return localStorage.setItem(key, value);
    } else {
      return this.setCookie(key, value);
    }
  };

  LocalStore.get = function(key) {
    if (window.lp.supports.localStorage) {
      return localStorage.getItem(key);
    } else {
      return this.getCookie(key);
    }
  };

  LocalStore.getCookie = function(key) {
    var cookieArray = document.cookie.split("; "),
        length = cookieArray.length,
        cookie;

    for (var i = 0; i < length; i++) {
      cookie = cookieArray.split("=");
      if (cookie[0] === key) {
        return cookie[1];
      }
    }
  };

  LocalStore.setCookie = function(key, value, days) {
    var date = new Date(),
        oneDay = 86400000,
        expiry;

    if (days) {
      date.setTime(date.getTime() + (days * oneDay));
      expiry = "; expires= " + date.toGMTString();
    } else {
      expiry = "";
    }

    window.document.cookie = "" + key + "=" + value + expiry + "; path=/";
  };

  LocalStore.removeCookie = function(key) {
    return this.setCookie(key, "", -1);
  };

  return LocalStore;
});
