define([], function() {

  "use strict";

  var ClientCache = function() {
    this.cacheStore = [];
    this.expiryTime = this._getCurrentTime() + (60 * 60 * 1000);
    this.maxCacheSize = 3;
  };

  // Client Cache Api

  ClientCache.prototype.store = function(url, data, extras) {
    if (this._spaceInCache()) {
      this.cacheStore.push(this._createCacheEntry(url, data, extras));
    } else {
      this.cacheStore.shift();
      this.cacheStore.push(this._createCacheEntry(url, data, extras));
    }
  };

  ClientCache.prototype.fetch = function(url) {
    if (this._isCacheAlive()) {
      return this._getCacheEntry(url);
    } else {
      this.cacheStore = [];
    }
  };

  // Private

  ClientCache.prototype._spaceInCache = function() {
    return this.cacheStore.length < this.maxCacheSize;
  };

  ClientCache.prototype._isCacheAlive = function() {
    return this._getCurrentTime() < this.expiryTime;
  };

  ClientCache.prototype._getCurrentTime = function() {
    return new Date().getTime();
  };

  ClientCache.prototype._createCacheEntry = function(url, data, extras) {
    return {
      url: url,
      data: data,
      extras: extras || {}
    };
  };

  ClientCache.prototype._makeEntryLatest = function(index) {
    var latestEntry = this.cacheStore.splice(index, 1);
    this.cacheStore.push(latestEntry[0]);
  };

  ClientCache.prototype._getCacheEntry = function(url) {
    var cachedEntry, index = 0, len = this.cacheStore.length;

    for (index; index < len; index++) {
      if (this.cacheStore[index].url == url) {
        cachedEntry = this.cacheStore[index];
        this._makeEntryLatest(index);
        return cachedEntry;
      }
    }
  };

  return ClientCache;

});
