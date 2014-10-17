(function(window, undefined) {
  "use strict";

  window._FS = (function() {

    function fs(options) {
      options = options || {};
      this.remoteUrl = options.remoteUrl || "//f.staticlp.com";
      this.log_max_size = options.log_max_size || 10;
      this.log_min_size = options.log_min_size || 3;
      this.log_max_interval = options.log_max_interval || 1500;
      this.debug = options.debug || false;
      this.session_id = options.u || options.session_id || Math.random() * 100000000000000000; // session_id id
      this.fid = options.fid || options.page_impression_id || (this.session_id + "-" + Date.now()); // flamsteed id
      this.schema = options.schema || "0.1";
      this.isCapable() && this._init(options.events);
    }

    fs.prototype.isCapable = function() {
      return !!(Function.prototype.bind && document.addEventListener);
    };

    fs.prototype.isRumCapable = function() {
      return !!(window.performance || window.msPerformance || window.webkitPerformance || window.mozPerformance);
    };

    fs.prototype.isNowCapable = function() {
      return this.isRumCapable() && !!window.performance.now;
    };

    fs.prototype.emptyBuffer = function() {
      this.buffer = [];
    };

    fs.prototype.log = function(data) {
      if (this.isCapable()) {
        data = this._addMetaData(data);
        this.debug && console.log("log:", data);
        this.buffer.push(data);
        this._flushIfFull();
      }
    };

    fs.prototype.time = function(data) {
      if (this.isNowCapable()) {
        this.log(data);
      }
    };

    fs.prototype.flush = function() {
      if (!this.flushing && this.buffer.length > 0) {
        this.debug && console.log("flushing:", this.buffer);
        this.flushing = true;
        this.resetTimer(this);
        this._sendData(this.buffer);
        this.emptyBuffer();
        this._tidyUp();
        this.flushing = false;
      }
    };

    fs.prototype.resetTimer = function() {
      window.clearInterval(this.interval);
      window.clearTimeout(this.timeout);
      this.timeout = window.setTimeout(this._startPoll.bind(this), this.log_max_interval);
    };

    // PRIVATE
    fs.prototype._flushIfFull = function() {
      this.buffer.length >= this.log_max_size && this.flush();
    };

    // PRIVATE
    fs.prototype._flushIfEnough = function() {
      this.buffer.length >= this.log_min_size && this.flush();
    };

    // PRIVATE
    fs.prototype._sendData = function(data) {
      this._appendImage.call(this, data);
    };

    // PRIVATE
    fs.prototype._appendImage = function(data) {
      this.image = document.createElement('img');
      this.image.style.visibility = "hidden";
      this.image.src = this.remoteUrl + "?" + this._serialize(data);
      return document.body.appendChild(this.image);
    };

    // PRIVATE
    fs.prototype._tidyUp = function() {
      if (this.image && this.image.parentNode) {
        this.image.parentNode.removeChild(this.image);
        return true;
      } else {
        return false;
      }
    };

    // PRIVATE
    fs.prototype._serialize = function(data) {
      var s = [], key, prop, obj, len = data.length;
      for (key in data) {
        obj = data[key];
        for (prop in obj) {
          if(obj.hasOwnProperty(prop)) {
            if(typeof(obj[prop]) === "object") {
              for (var p in obj[prop]) {
                s.push(this._toParam(key, p, obj[prop][p]));
              }
            } else {
              s.push(this._toParam(key, prop, obj[prop]));
            }
          }
        }
      }
      return s.join("&").replace(/%20/g, "+");
    };

    // PRIVATE
    fs.prototype._toParam = function(index, key, val) {
      return '[' + index + ']' + '[' + this._sanitizeValue(key) + ']' + '=' + this._sanitizeValue(val);
    };

    // PRIVATE
    fs.prototype._sanitizeValue = function(val) {
      if (typeof val == "string" && val == "") {
        val = null;
      }
      return encodeURIComponent(val);
    };

    // PRIVATE
    fs.prototype._addMetaData = function(data) {
      if (data['t'] === undefined && this.isNowCapable()) {
        data.t = window.performance.now();
      }
      data.session_id = this.session_id;
      data.fid = this.fid;
      data.schema = this.schema;

      return data;
    };

    // PRIVATE
    fs.prototype._startPoll = function() {
      this.interval = window.setInterval(this._flushIfEnough.bind(this), this.log_max_interval);
    };

    // PRIVATE
    fs.prototype._processRum = function() {
      return window.performance.timing;
    };

    // PRIVATE
    fs.prototype._logRumAndFlush = function() {
      this.log(this._processRum(), true);
      this.flush();
    };

    // PRIVATE
    fs.prototype._init = function(seedEvents) {
      this.emptyBuffer();
      this.resetTimer();
      if (seedEvents && seedEvents.length > 0) {
        seedEvents.map(function(e){
          this.log(e);
        }, this);
      }
      if (this.isRumCapable()) {
        window.addEventListener("unload", this._logRumAndFlush.bind(this));
      }
      this.flush();
    };

    return fs;
  })();

  if ( typeof define === "function") {
    define( "flamsteed", [], function () { return window._FS; } );
  }

})(this);
