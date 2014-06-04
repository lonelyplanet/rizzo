define([
  "jquery",
  "jplugs/jquery-cookies.2.2.0"
], function($) {

  "use strict";

  return function ShoppingCart() {
    var itemCount;

    this.cartData = $.cookies.get("shopCartCookie");
    itemCount = this.cartData && this.cartData.A && this.cartData.A.length;
    if (itemCount) {
      $(".js-user-basket").append("<span class='notification-badge notification-badge--basket-items wv--inline-block js-basket-items'>" + itemCount + "</span>");
    }
  };

});
