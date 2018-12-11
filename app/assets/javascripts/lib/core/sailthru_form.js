define([
  "jquery",
  "lib/utils/alert"
], function($, Alert) {

  "use strict";

  // @args = {}
  // el: {string} selector for form
  // alert: {string} selector for alert wrapper,
  //        will display notifications after submit
  function SailthruForm(args) {
    this.$el = $(args.el);
    this.$alert = $(args.alert);
    this.$el.length && this.init();
  }

  SailthruForm.prototype.init = function() {
    this.alert = new Alert({ container: this.$alert });
    this.listen();
  };

  SailthruForm.prototype.listen = function() {
    this.$el.on("submit", this._handleSubmit.bind(this));
  };

  SailthruForm.prototype._handleSubmit = function(event) {
    event.preventDefault();

    $.post(this.$el.attr("action"), this.$el.serialize())
      .done(this._handleSubmitSuccess.bind(this))
      .fail(this._handleSubmitError.bind(this));
  };

  SailthruForm.prototype._handleSubmitSuccess = function() {
    var lpAnalyticsTrackerPresent =
      window.lp &&
      window.lp.analytics &&
      window.lp.analytics.track &&
      typeof window.lp.analytics.track === "function";

    if (lpAnalyticsTrackerPresent) {
      window.lp.analytics.track({
        event: "newsletter-subscribe"
      });
    }
    this.alert.success({
      title: "Success!",
      content: "Thank you for subscribing, " +
        "you'll soon receive an email confirming your subscription."
    }, true);
  };

  SailthruForm.prototype._handleSubmitError = function(xhr) {
    if (xhr.status === 409) {
      this.alert.announcement({
        title: "",
        content: "You are already subscribed."
      }, true);
    } else {
      this.alert.error({
        title: "Error. ",
        content: "Something went wrong."
      }, true);
    }
  };

  return SailthruForm;
});
