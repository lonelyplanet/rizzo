window.lp = {};
window.lp.supports = {
  transform: {
    css: ""
  }
};
window.lp.isMobile = false;
window.lpUserStatusCallback = function() {};


window.lp.analytics = {
  api: {
    trackEvent: function() {}
  }
};

require.config({
  paths: {
    "picker": "vendor/assets/javascripts/pickadate/lib/picker"
  }
});
