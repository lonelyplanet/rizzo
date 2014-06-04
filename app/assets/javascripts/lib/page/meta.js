define([ "jquery" ], function($) {

  "use strict";

  function Meta() {
    this.$listener = $("#js-card-holder");
    this.listen();
  }

  Meta.prototype.listen = function() {
    this.$listener.on(":cards/received", this._received.bind(this));
    this.$listener.on(":page/received", this._received.bind(this));
  };

  // Private

  Meta.prototype._received = function( e, data ) {
    if (data.copy && data.copy.title){
      this._updateTitle(data.copy.title);
      this._updateMeta(data);
    }
  };

  Meta.prototype._updateTitle = function( title ) {
    document.title = title;
  };

  Meta.prototype._updateMeta = function( data ) {
    $("meta[name='title']").attr("content", data.copy.title);
    $("meta[name='description']").attr("content", data.copy.description);
  };

  return Meta;

});
