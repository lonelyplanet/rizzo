define([ "jquery", "lib/utils/debounce", "timeago/jquery.timeago" ], function($, Debounce) {

  "use strict";

  var breakpoint, calculateMonth, calculateYear, debouncedCallback, enableTimer, extendTimeago, monthNames, strings;
  monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
  breakpoint = 768;
  enableTimer = false;
  calculateMonth = function(number, distanceMillis) {
    return monthNames[new Date(Date.now() - distanceMillis).getMonth()];
  };
  calculateYear = function(number, distanceMillis) {
    return new Date(Date.now() - distanceMillis).getFullYear().toString();
  };
  strings = {
    desktop: {
      suffixAgo: null,
      seconds: "just now",
      minute: "a minute ago",
      minutes: "%d minutes ago",
      hour: "an hour ago",
      hours: "%d hours ago",
      day: "a day ago",
      days: "%d days ago",
      month: "a month ago",
      months: "%d months ago",
      year: "a year ago",
      years: "%d years ago"
    },
    mobile: {
      suffixAgo: null,
      seconds: "%ds",
      minute: "%dm",
      minutes: "%dm",
      hour: "%dh",
      hours: "%dh",
      day: "%dd",
      days: "%dd",
      month: calculateMonth,
      months: calculateMonth,
      year: calculateYear,
      years: calculateYear
    }
  };
  extendTimeago = function() {
    var currentClientWidth;
    currentClientWidth = document.documentElement.clientWidth;
    $.extend($.timeago.settings.strings, currentClientWidth > breakpoint ? strings.desktop : strings.mobile);
    return $("time.timeago").timeago();
  };
  extendTimeago();
  debouncedCallback = new Debounce(extendTimeago, 200);
  $(window).resize(debouncedCallback);
});
