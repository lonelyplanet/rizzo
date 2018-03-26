define([
  "jquery",
  "public/assets/javascripts/lib/components/link_to"
], function($, LinkTo) {

  "use strict";

  describe("linkTo", function() {

    var $container, linkTo, redirectSpy;

    beforeEach(function() {
      loadFixtures("link_to.html");
      linkTo = new LinkTo("#listener");
      redirectSpy = spyOn(LinkTo.prototype,  "_redirect");

      $container = $("[data-link-to]");
    });

    describe("Redirecting", function() {

      it("happens when the element itself is clicked on", function() {
        $container.trigger("click");
        expect(redirectSpy).toHaveBeenCalledWith("/foo");
      });

      it("happens when a non-blacklisted element is clicked on", function() {
        $container.find("p").trigger("click");
        expect(redirectSpy).toHaveBeenCalledWith("/foo");
      });

      it("doesn't happen when an anchor element is clicked on", function() {
        $container.find("a").trigger("click");
        expect(redirectSpy).not.toHaveBeenCalled();
      });

      it("doesn't happen when a button element is clicked on", function() {
        $container.find("button").trigger("click");
        expect(redirectSpy).not.toHaveBeenCalled();
      });

      it("doesn't happen when an input element is clicked on", function() {
        $container.find("input").trigger("click");
        expect(redirectSpy).not.toHaveBeenCalled();
      });

      it("doesn't happen when a label element is clicked on", function() {
        $container.find("label").trigger("click");
        expect(redirectSpy).not.toHaveBeenCalled();
      });

      it("doesn't happen when an option element is clicked on", function() {
        $container.find("option").trigger("click");
        expect(redirectSpy).not.toHaveBeenCalled();
      });

      it("doesn't happen when a select element is clicked on", function() {
        $container.find("select").trigger("click");
        expect(redirectSpy).not.toHaveBeenCalled();
      });

      it("doesn't happen when element with 'js-prevent-link-to' class is clicked on", function() {
        $container.find(".js-prevent-link-to").trigger("click");
        expect(redirectSpy).not.toHaveBeenCalled();
      });

    });

  });

});
