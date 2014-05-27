window.lp = {};
window.lp.supports = {};
window.lp.isMobile = false;
window.lpUserStatusCallback = function() {};

require.config({
  paths: {
    jquery: "vendor/assets/javascripts/jquery/jquery",
    lib: "public/assets/javascripts/lib",
    jplugs: "vendor/assets/javascripts/jquery-plugins",
    touchwipe: "vendor/assets/javascripts/jquery.touchwipe.1.1.1",
    s_code: "vendor/assets/javascripts/omniture/s_code",
    nouislider: "vendor/assets/javascripts/nouislider",
    timeago: "vendor/assets/javascripts/timeago"
  }
});
