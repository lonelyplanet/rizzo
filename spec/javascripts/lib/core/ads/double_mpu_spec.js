require([ "public/assets/javascripts/lib/core/ads/double_mpu" ], function(DoubleMPU) {

  describe("Ad extension: Double MPU", function() {

    var instance, $target, $card, $stack, originalPosition;

    beforeEach(function() {
      loadFixtures("double_mpu.html");

      $target = $(".adunit");
      $card = $target.closest(".js-card-ad");
      $stack = $card.closest(".js-stack");

      originalPosition = $card.offset();

      instance = new DoubleMPU($target, $card);
    });

    describe("._init()", function() {

      it("Should create a placeholder card in the correct grid position", function() {
        var $placeholder = $stack.find(".ad--placeholder");
        expect($placeholder.length).toBe(2);
        expect($stack.find(".js-card").index($placeholder.eq(0))).toBe(2);
        expect($stack.find(".js-card").index($placeholder.eq(1))).toBe(6);
      });

      it("Should absolutely position the MPU card", function() {
        expect($card.css("position")).toEqual("absolute");
        expect($card.offset().top).toEqual(originalPosition.top);
        expect($card.offset().left).toEqual(originalPosition.left);
      });

    });

  });

});
