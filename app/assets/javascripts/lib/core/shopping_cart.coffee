define ['jquery', 'jplugs/jquery-cookies.2.2.0'], ($)->

  class ShoppingCart

    @version = '0.0.13'

    constructor: ->
      itemCount = null
      @cartData = $.cookies.get("shopCartCookie")
      if (@cartData && @cartData["A"])
        itemCount = @cartData["A"].length
      if (itemCount)
        $(".js-user-basket").append("<span class=\"notification-badge notification-badge--basket-items js-basket-items\">#{itemCount}</span>")
