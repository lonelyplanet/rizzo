require([ "public/assets/javascripts/lib/utils/css_helper.js" ], function(CSSHelper) {
  "use strict";
  window.CSSHelper = CSSHelper;
  describe("CSSHelper", function() {
    describe("propertiesFor", function() {
      loadFixtures("css_helper.html");
      var properties = CSSHelper.propertiesFor("wow", [ "height" ]);
      expect(properties).toEqual({
        height: "20px"
      });
    });

    describe("stripPx", function() {
      expect(CSSHelper.stripPx("10000px")).toBe("10000");
    });

    describe("extractUrl", function() {
      it("turns a css property containing a url into a url string", function() {
        expect(CSSHelper.extractUrl("url(\"http://sausages.com/dog.png\")")).toBe("http://sausages.com/dog.png");
      });
    });
  });
});
