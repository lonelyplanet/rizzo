require([ "jquery", "public/assets/javascripts/lib/utils/link_to" ], function($, LinkTo) {

  "use strict";

  describe("linkTo", function() {

    var $container, linkTo;

    beforeEach(function() {
      loadFixtures("link_to.html");
      linkTo = new LinkTo();
      spyOn(linkTo, "_redirect");

      $container = $("[data-link-to]");
    });

    describe("Redirecting", function() {

      it("happens when the element itself is clicked on", function() {
        $container.trigger("click");
        expect(linkTo._redirect).toHaveBeenCalledWith("/foo");
      });

      it("happens when a non-blacklisted element is clicke on", function() {
        $container.find("p").trigger("click");
        expect(linkTo._redirect).toHaveBeenCalledWith("/foo");
      });

      it("doesn't happen when an anchor element is clicked on", function() {
        $container.find("a").trigger("click");
        expect(linkTo._redirect).not.toHaveBeenCalled();
      });

      it("doesn't happen when a button element is clicked on", function() {
        $container.find("button").trigger("click");
        expect(linkTo._redirect).not.toHaveBeenCalled();
      });

      it("doesn't happen when an input element is clicked on", function() {
        $container.find("input").trigger("click");
        expect(linkTo._redirect).not.toHaveBeenCalled();
      });

      it("doesn't happen when a label element is clicked on", function() {
        $container.find("label").trigger("click");
        expect(linkTo._redirect).not.toHaveBeenCalled();
      });

      it("doesn't happen when an option element is clicked on", function() {
        $container.find("option").trigger("click");
        expect(linkTo._redirect).not.toHaveBeenCalled();
      });

      it("doesn't happen when a select element is clicked on", function() {
        $container.find("select").trigger("click");
        expect(linkTo._redirect).not.toHaveBeenCalled();
      });

    });

  });

});
