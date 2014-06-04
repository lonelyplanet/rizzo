require(["public/assets/javascripts/lib/utils/asset_reveal.js"], function(AssetReveal) {

  describe("AssetReveal", function() {
    var assetReveal;

    beforeEach(function() {
      loadFixtures("asset_reveal.html");
      assetReveal = new AssetReveal;
    });

    describe("Object", function() {
      it("is defined", function() {
        expect(AssetReveal).toBeDefined();
      });
    });

    describe("Initialisation", function() {
      beforeEach(function() {
        spyOn(assetReveal, "_listen");
      });

      it("does not initialise when the element does not exist", function() {
        expect(assetReveal._listen).not.toHaveBeenCalled();
      });
    });

    describe("Uncommenting", function() {
      beforeEach(function() {
        $("#js-row--content").trigger(":asset/uncomment", [".foo1"]);
      });

      it("uncomments the image", function() {
        expect(assetReveal.$el.find(".bar").length).toBe(1);
      });
    });

    describe("Uncommenting a script", function() {
      beforeEach(function() {
        spyOn(console, "log");
        $("#js-row--content").trigger(":asset/uncommentScript", [".foo2", "[data-uncomment]"]);
      });

      it("uncomments the script block", function() {
        expect(console.log).toHaveBeenCalledWith("This test passes");
      });
    });

    describe("Unblocking a background image", function() {
      beforeEach(function() {
        $("#js-row--content").trigger(":asset/loadBgImage", [".foo3"]);
      });

      it("removes the image blocking class", function() {
        expect(assetReveal.$el.find(".image")).not.toHaveClass("rwd-image-blocker");
      });
    });

    describe("Swapping an element with data-src for an image", function() {
      beforeEach(function() {
        $("#js-row--content").trigger(":asset/loadDataSrc", [".foo4"]);
      });

      it("swaps the placeholder ", function() {
        var $img = assetReveal.$el.find(".image-placeholder");
        expect($img.length).toBe(1);
        expect($img.attr("src")).toEqual("path/to/image");
        expect($img.attr("alt")).toEqual("image alt text");
      });
    });

  });

});
