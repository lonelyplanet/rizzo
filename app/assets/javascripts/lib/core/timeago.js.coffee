# Config script for jquery.timeago.js plugin
require [
  'lib/utils/debounce'
  'jquery.timeago'
], (Debounce) ->

  jQuery ($) ->
    monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    breakpoint = 768 # width in px to switch between strings.mobile/desktop
    enableTimer = false

    calculateMonth = (number, distanceMillis) ->
      return  monthNames[new Date(Date.now() - distanceMillis).getMonth()]

    calculateYear = (number, distanceMillis) ->
      return  new Date(Date.now() - distanceMillis).getFullYear().toString()

    strings =
      desktop:
        suffixAgo: null
        seconds: "just now"
        minute: "a minute ago"
        minutes: "%d minutes ago"
        hour: "an hour ago"
        hours: "%d hours ago"
        day: "a day ago"
        days: "%d days ago"
        month: "a month ago"
        months: "%d months ago"
        year: "a year ago"
        years: "%d years ago"
      mobile:
        suffixAgo: null
        seconds: "%ds"
        minute: "%dm"
        minutes: "%dm"
        hour: "%dh"
        hours: "%dh"
        day: "%dd"
        days: "%dd"
        month: calculateMonth
        months: calculateMonth
        year: calculateYear
        years: calculateYear

    extendTimeago = ->
      currentClientWidth = document.documentElement.clientWidth
      $.extend $.timeago.settings.strings,
        if currentClientWidth > breakpoint
          strings.desktop
        else
          strings.mobile
      $("time.timeago").timeago()

    extendTimeago()

    debouncedCallback = Debounce extendTimeago, 200
    $(window).resize debouncedCallback
