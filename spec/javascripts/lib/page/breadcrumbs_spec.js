require([ "jquery", "public/assets/javascripts/lib/page/breadcrumbs.js" ], function($, Breadcrumbs) {

  "use strict";

  describe("Breadcrumbs", function() {

    describe("Initialisation", function() {

      beforeEach(function() {
        window.breadcrumbs = new Breadcrumbs({});
      });

      it("is defined", function() {
        expect(window.breadcrumbs).toBeDefined();
      });

    });

    describe("Functionality", function() {

      beforeEach(function() {
        loadFixtures("breadcrumbs.html");
      });

      it("updates the nav bar when given the place", function() {
        var $placeTitleLink = $(".js-place-title-link");

        window.breadcrumbs._updateNavBar({ slug: "foo", name: "Foo" });

        expect($placeTitleLink.attr("href")).toBe("/foo");
        expect($placeTitleLink.text()).toBe("Foo");
      });

      it("updates the breadcrumbs when given the html", function() {
        window.breadcrumbs._updateBreadcrumbs(".js-breadcrumbs-content");

        expect($(".js-breadcrumbs-content").html()).toBe("Bar");
      });

    });

  });
});
