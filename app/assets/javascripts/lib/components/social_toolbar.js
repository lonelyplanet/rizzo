// -----------------------------------------------------------------------------
//
// Update the Social Toolbar after client side navigation
//
// After navigation we need to let the social buttons reflect the new url, as
// well as updating some meta values. Each is slightly different, of course.
//
// -----------------------------------------------------------------------------

define([ "jquery", "lib/mixins/page_state" ], function($, withPageState) {

  "use strict";

  var SocialToolbar = function() {
    this.$listener = $("#js-row--content");
    this.el = ".js-social-toolbar";
    this.shares = [
      { name: "google-plus", separator: "url",  encodeURI: true },
      { name: "facebook",    separator: "u",    encodeURI: true },
      { name: "stumbleupon", separator: "url",  encodeURI: true },
      { name: "tumblr",      separator: "url",  encodeURI: true },
      { name: "pinterest",   separator: "url",  encodeURI: true },
      { name: "twitter",     separator: "text", hasMeta: true },
      { name: "mailto",      separator: "body", hasMeta: true }
    ];

    this.listen();
  };

  withPageState.call(SocialToolbar.prototype);

  // ---------------------------------------------------------------------------
  // Subscribe to Events
  // ---------------------------------------------------------------------------

  SocialToolbar.prototype.listen = function() {
    this.$listener.on(":page/received", function(e, data) {
      this.$el = this.$listener.find(this.el);
      if (!this.$el.length) return;

      if (data && data.displaySocial) {
        this._updateLinks(data);
        this.$el.removeClass("is-hidden");
      } else {
        this.$el.addClass("is-hidden");
      }
    }.bind(this));
  };

  // ---------------------------------------------------------------------------
  // Private Functions
  // ---------------------------------------------------------------------------

  SocialToolbar.prototype._updateLinks = function(data) {
    var url = this.getUrl(), i = 0, share;
    for (i; i < this.shares.length; i++) {
      share = this.shares[i];
      if (!share.hasMeta) {
        this._updateLink(share, url);
      }
    }
    if (data.copy && data.copy.title) {
      this._updateTweetMeta(url, data);
      this._updateMailtoMeta(url, data);
    }
  };

  SocialToolbar.prototype._updateTweetMeta = function(url, data) {
    var $tw = this.$el.find(".js-twitter-share");

    $tw.length && $tw.attr("href",
      $tw.attr("href")
        .replace(/(text=).+?(?=via)/, "text=" + (data.copy.tweet || data.copy.title) + " " + url + " ")
    );
  };

  SocialToolbar.prototype._updateMailtoMeta = function(url, data) {
    var $mail = this.$el.find(".js-mailto-share");

    $mail.length && $mail.attr("href",
      $mail.attr("href")
        .replace(/(subject=)[^&]+/, "subject=" + data.copy.title)
        .replace(/(body=)[^&]+/, "body=" + url)
    );
  };

  SocialToolbar.prototype._updateLink = function(share, url) {
    var $link = this.$el.find(".js-" + share.name + "-share"),
        pattern = new RegExp(share.separator + "=[^&]+", "g"),
        shareUrl = share.encodeURI ? encodeURIComponent(url) : url;

    $link.length && $link.attr("href",
      $link.attr("href")
        .replace(pattern, share.separator + "=" + shareUrl)
    );
  };

  $(document).ready(function() {
    new SocialToolbar;
  });

  return SocialToolbar;

});
