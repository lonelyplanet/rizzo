define([
  "jquery",
  "lib/mixins/page_state",
  "polyfills/function_bind"
], function($, withPageState) {

  "use strict";

  var PushState = function PushState( args ) {
    args || (args = {});
    $.extend(this.config, args);

    // Ignore initial popstate in chrome
    // https://code.google.com/p/chromium/issues/detail?id=63040
    this.popStateFired = false;
    this.currentUrl = this.getUrl();

    this._initHistory();

  };

  // -------------------------------------------------------------------------
  // Mixins
  // -------------------------------------------------------------------------

  withPageState.call(PushState.prototype);

  // -------------------------------------------------------------------------
  // Public
  // -------------------------------------------------------------------------

  PushState.prototype.navigate = function( state, rootUrl, replaceState ) {

    var url = this._createUrl( state, rootUrl );
    if ( this._supportsHistory() || this._supportsHash() ) {
      this._setState( url, replaceState );
    } else {
      this.setUrl( url );
    }

  };

  // -------------------------------------------------------------------------
  // Private
  // -------------------------------------------------------------------------

  PushState.prototype._initHistory = function() {
    if ( this._supportsHistory() ) {
      $( window ).bind( "popstate", function() {
        this._handlePopState();
      }.bind(this));
    } else if ( this._supportsHash() ) {
      // ie8 and ie9
      this.allowHistoryNav = true;
      // Set up our event listener to listen to hashchange (back/forward)
      $(window).on( "hashchange", this._onHashChange );
      // If there's a hash on page load, fire the _onHashChange function and redirect the user to the correct page.
      if ( this.getHash() ) {
        this._onHashChange();
      }
    }
  };

  PushState.prototype._handlePopState = function() {
    if ( !this.popStateFired ) {
      this.popStateFired = true;
      if ( this.getUrl() === this.currentUrl ) return;
    }

    this.setUrl( this.getUrl() );
  };

  PushState.prototype._supportsHistory = function() {
    if (this.isHistoryEnabled === undefined ) {
      return this.isHistoryEnabled = (window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/));
    }

    return this.isHistoryEnabled;
  };

  PushState.prototype._supportsHash = function() {
    if ( this.isHashEnabled === undefined ) {
      return this.isHashEnabled = ("onhashchange" in window);
    }
    return this.isHashEnabled;
  };

  // If navigating to a subsection we pass in the new document root
  PushState.prototype._createUrl = function( state, documentRoot ) {
    var params = ( state ? "?" + state : "" );

    if ( this._supportsHistory() ) {
      return documentRoot + params;
    } else {
      return "#!" + documentRoot + params;
    }
  };

  PushState.prototype._replaceUrl = function( url ) {
    if ( this._supportsHistory() || this._supportsHash() ) {
      this._setState( url, true );
    } else {
      this.setUrl( url );
    }
  };

  PushState.prototype._setState = function( url, replaceState ) {
    if ( this._supportsHistory() ) {
      if ( replaceState ) {
        window.history.replaceState({}, null, url);
      } else {
        window.history.pushState({}, null, url);
        // Chrome workaround
        this.currentUrl = this.getUrl();
      }
    } else {
      // Ensure we don't trigger a refresh
      this.allowHistoryNav = false;
      // Store the new url in the hash
      this.setHash( url );
    }

  };

  PushState.prototype._onHashChange = function() {
    var hash, url;

    // Only cause a refresh if it's back/forward
    if (this.allowHistoryNav) {
      hash = this.getHash();
      if (hash) {
        url = hash.substring(2);
      } else {
        url = this.getUrl();
      }
      this.setUrl( url );
    }

    // Ensure we are always listening for back/forward navigation
    this.allowHistoryNav = true;
  };

  return PushState;

});
