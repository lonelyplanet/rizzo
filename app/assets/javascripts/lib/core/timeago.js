define([ "jquery", "lib/utils/debounce", "timeago/jquery.timeago" ], function($, debounce) {

  "use strict";

  var breakpoint = 768,
      monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],

      calculateMonth = function(number, distanceMillis) {
        return monthNames[new Date(Date.now() - distanceMillis).getMonth()];
      },

      calculateYear = function(number, distanceMillis) {
        return new Date(Date.now() - distanceMillis).getFullYear().toString();
      },

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
      },

      extendTimeago = function() {
        var isDesktop = document.documentElement.clientWidth > breakpoint;

        $.extend($.timeago.settings.strings, isDesktop ? strings.desktop : strings.mobile);

        return $("time.timeago").timeago();
      };

  extendTimeago();

  $(window).resize(debounce(extendTimeago, 200));

});
