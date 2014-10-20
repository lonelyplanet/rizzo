// ----------------------------------------------------------
//
// LocalStore (util)
// Serialize key,value into localstorage with cookies fallback
// for browsers that doesn't support localstorage.
//
// ----------------------------------------------------------

define(function() {

  "use strict";

  function LocalStore() {}

  LocalStore.prototype.set = function(k, v, days) {
    if (window.lp.supports.localStorage) {
      return localStorage.setItem(k, v);
    } else {
      return this.setCookie(k, v, days);
    }
  };

  LocalStore.prototype.get = function(k) {
    if (window.lp.supports.localStorage) {
      return localStorage.getItem(k);
    } else {
      return this.getCookie(k);
    }
  };

  LocalStore.prototype.remove = function(k) {
    if (window.lp.supports.localStorage) {
      return localStorage.removeItem(k);
    } else {
      return this.removeCookie(k);
    }
  };

  LocalStore.prototype.getCookie = function(k, string) {
    var c = string ? string.split("; ") : document.cookie.split("; "),
        cookies = {};

    for (var i = 0, a; i < c.length; i++) {
      a = c[i].split("=");
      cookies[a[0]] = a[1];
    }

    return cookies[k];
  };

  LocalStore.prototype.setCookie = function(k, v, days, domain, path) {
    var exp = "";

    if (days && (days !== 0)) {
      exp = new Date();
      exp.setTime(exp.getTime() + (days * 86400000));
      exp = "; expires=" + exp.toGMTString();
    }

    domain = domain ? ("; domain=" + domain) : "";
    path = "; path=" + (path || "/");

    return window.document.cookie = k + "=" + v + exp + domain + path;
  };

  LocalStore.prototype.removeCookie = function(k, domain, path) {
    return this.setCookie(k, "", -1, domain, path);
  };

  return LocalStore;
});
