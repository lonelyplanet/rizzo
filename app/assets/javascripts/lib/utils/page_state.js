define(function() {

  "use strict";

  var PageState = function() {
    this.checkFilters = /filters/;
    this.checkSearch = /search/;
    this.legacyBrowsers = /(browser)?ie(7|8)/i;
  };

  PageState.prototype.getUrl = function() {
    return window.location.href;
  };

  PageState.prototype.getSlug = function() {
    return window.location.pathname;
  };

  PageState.prototype.getParams = function() {
    return window.location.search.replace(/^\?/, "");
  };

  PageState.prototype.getHash = function() {
    return window.location.hash;
  };

  PageState.prototype.getViewPort = function() {
    return document.documentElement.clientWidth;
  };

  PageState.prototype.getLegacyRoot = function() {
    if (this.legacyBrowsers.test(document.documentElement.className)) {
      return document.documentElement;
    } else if (this.legacyBrowsers.test(document.body.className)) {
      return document.body;
    }
  };

  PageState.prototype.getDocumentRoot = function() {
    var slug = this.getSlug();

    return this.createDocumentRoot(slug);
  };

  PageState.prototype.isLegacy = function() {
    return !!this.getLegacyRoot();
  };

  PageState.prototype.setUrl = function(url) {
    return window.location.replace(url);
  };

  PageState.prototype.setHash = function(hash) {
    return window.location.hash = hash;
  };

  PageState.prototype.createDocumentRoot = function(slug) {
    var newSlug = slug.split("/");

    if (this.withinFilterUrl()) {
      return newSlug.pop() && newSlug.join("/");
    } else {
      return slug;
    }
  };

  PageState.prototype.withinFilterUrl = function() {
    var cardHolder = document.getElementById("js-card-holder");

    return cardHolder && cardHolder.getAttribute("data-filter-subcategory") == "true";
  };

  PageState.prototype.hasFiltered = function() {
    return this.withinFilterUrl() || this.checkFilters.test(this.getParams());
  };

  PageState.prototype.hasSearched = function() {
    var params = this.getParams();

    return this.checkSearch.test(params);
  };

  return PageState;

});
