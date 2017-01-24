define(function() {

  "use strict";

  if (window.lp.isAdblockActive === true){

    window.lp.analytics.api.trackEvent({
      category: "advertising",
      action: "loaded-with-adblock",
      label: window.location.pathname
    });
  } else {
    window.lp.analytics.api.trackEvent({
      category: "advertising",
      action: "loaded-without-adblock",
      label: window.location.pathname
    });

  }
});
