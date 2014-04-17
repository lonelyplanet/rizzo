define(function() {

  "use strict";

  function DoubleMPU($target, $card) {
    this.$target = $target;
    this.$card = $card;
    this._init();
  }

  DoubleMPU.prototype._init = function() {
    var $grid = this.$card.closest(".js-stack"),
        $cards = $grid.find(".js-card"),
        index = $cards.index(this.$card),
        position = this.$card.position(),
        cardsPerRow = Math.floor( $grid.width() / $cards.filter(".card--single").width() ),
        placeholderHTML = "<div class='card card--double ad--placeholder js-card' />";

    // The placeholder is two cards wide
    $cards.eq(index).before(placeholderHTML);
    $cards.eq(index + (cardsPerRow - 2)).after(placeholderHTML);

    this.$card.css({
      position: "absolute",
      left: position.left,
      top: position.top
    });
  };

  return DoubleMPU;

});
