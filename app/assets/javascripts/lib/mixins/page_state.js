define([], function() {

  "use strict";

  var withPageState = function() {
    this.checkFilters = /filters/;
    this.checkSearch = /search/;
    this.legacyBrowsers = /(browser)?ie(7|8)/i;

    this.getUrl = function() {
      return window.location.href;
    };

    this.getSlug = function() {
      return window.location.pathname;
    };

    this.getParams = function() {
      return window.location.search.replace(/^\?/, "");
    };

    this.getHash = function() {
      return window.location.hash;
    };

    this.getViewPort = function() {
      return document.documentElement.clientWidth;
    };

    this.getLegacyRoot = function() {
      if (this.legacyBrowsers.test(document.documentElement.className)) {
        return document.documentElement;
      } else if (this.legacyBrowsers.test(document.body.className)) {
        return document.body;
      }
    };

    this.getDocumentRoot = function() {
      var slug = this.getSlug();

      return this.createDocumentRoot(slug);
    };

    this.isLegacy = function() {
      return !!this.getLegacyRoot();
    };

    this.setUrl = function(url) {
      return window.location.replace(url);
    };

    this.setHash = function(hash) {
      return window.location.hash = hash;
    };

    this.createDocumentRoot = function(slug) {
      var newSlug = slug.split("/");

      if (this.withinFilterUrl()) {
        return newSlug.pop() && newSlug.join("/");
      } else {
        return slug;
      }
    };

    this.withinFilterUrl = function() {
      var cardHolder = document.getElementById("js-card-holder");

      return cardHolder && cardHolder.getAttribute("data-filter-subcategory") == "true";
    };

    this.hasFiltered = function() {
      return this.withinFilterUrl() || this.checkFilters.test(this.getParams());
    };

    this.hasSearched = function() {
      var params = this.getParams();

      return this.checkSearch.test(params);
    };

  };

  return withPageState;

});
