# ----------------------------------------------------------
#
# LocalStore (util)
# Serialize key,value into localstorage with cookies fallback
# for browsers that doesn't support localstorage.
#
# ----------------------------------------------------------



define ->

  class LocalStore

    @version = '0.0.1'

    @set = (k,v) ->
      if window.lp.supports.localStorage
        localStorage.setItem(k, v)
      else
        @setCookie(k, v)

    @get = (k) ->
      if window.lp.supports.localStorage
        localStorage.getItem(k || 'cookie-compliance')
      else
        @getCookie(k || 'cookie-compliance')

    @getCookie = (k) ->
      c = document.cookie.split('; ')
      cookies = {}
      for b in c
        a = b.split('=')
        cookies[a[0]] = a[1]
      cookies[k]

    @setCookie = (k, v, days) ->
      if days
        date = new Date
        date.setTime(date.getTime() + (days * 86400000))
        exp = "; expires= #{date.toGMTString()}"
      else
        exp =""
      window.document.cookie = "#{k}=#{v}#{exp}; path=/"

    @removeCookie = (k) ->
      @setCookie(k,'',-1)
