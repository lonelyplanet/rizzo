require([ "jquery", "public/assets/javascripts/lib/components/socialToolbar.js" ], function($, SocialToolbar) {

  "use strict";

  describe("SocialToolbar", function() {

    describe("", function() {

      beforeEach(function() {
        window.socialToolbar = new SocialToolbar({ el: "#js-social" });
      });

      it("is defined", function() {
        expect(socialToolbar).toBeDefined();
      });

    });

    describe("Initialisation", function() {

      describe("When the Toolbar should not be loaded", function() {
        beforeEach(function() {
          window.socialToolbar = new SocialToolbar({ el: "#js-social-not-to-be-displayed" });
          loadFixtures("socialToolbar.html");
          spyOn(window.socialToolbar, "_shouldLoadButtons").andReturn(false);
          window.socialToolbar.constructor({ el: "#js-social-not-to-be-displayed" });
        });

        it("does not display the social bar", function() {
          expect($("#js-social-not-to-be-displayed")).toHaveClass("is-hidden");
          expect(window.socialToolbar.proximityLoader).not.toBeDefined();
        });
      });

      describe("When the Toolbar should be loaded", function() {
        beforeEach(function() {
          window.socialToolbar = new SocialToolbar({ el: "#js-social" });
          loadFixtures("socialToolbar.html");
          spyOn(window.socialToolbar, "_shouldLoadButtons").andReturn(true);
          window.socialToolbar.constructor({ el: "#js-social" });
        });

        it("displays the social bar", function() {
          expect($("#js-social")).not.toHaveClass("is-hidden");
          expect(window.socialToolbar.proximityLoader.config.el).toBe("#js-social");
          expect(window.socialToolbar.proximityLoader.config.list).toBe("#js-facebook-like, #js-tweet, #js-google-plus")
        });
      });

    });

    describe("On ajax complete", function() {
      describe("When the Toolbar should not be loaded", function() {
        beforeEach(function() {
          loadFixtures("socialToolbar.html");
          window.socialToolbar = new SocialToolbar({ el: "#js-social-not-to-be-displayed" });
          spyOn(window.socialToolbar, "_shouldLoadButtons").andReturn(false);
          $("#js-row--content").trigger(":page/received");
        });

        it("does not remove the comments", function() {
          expect($("#js-social-not-to-be-displayed")).toHaveClass("is-hidden");
          expect(window.socialToolbar.proximityLoader).not.toBeDefined();
        });
      });

      describe("When the Toolbar should be hidden", function() {
        beforeEach(function() {
          loadFixtures("socialToolbar.html");
          window.socialToolbar = new SocialToolbar({ el: "#js-social-loaded" });
          spyOn(window.socialToolbar, "_shouldLoadButtons").andReturn(false);
          $("#js-row--content").trigger(":page/received");
        });

        it("does not remove the comments", function() {
          expect($("#js-social-loaded")).toHaveClass("is-hidden");
        });
      });

      describe("When the buttons should be loaded", function() {
        describe("and are already visible", function() {
          beforeEach(function() {
            loadFixtures("socialToolbar.html");
            window.socialToolbar = new SocialToolbar({ el: "#js-social-loaded" });
            spyOn(window.socialToolbar, "_shouldLoadButtons").andReturn(true);
            spyOn(window.socialToolbar, "getUrl").andReturn("http://www.lonelyplanet.com/foo");
            $("#js-row--content").trigger(":page/received");
          });

          it("updates the url on the mailto link", function() {
            var newUrl = $("#js-social-loaded").find(".js-mailto-link").attr("href");
            expect(newUrl).toContain("http://www.lonelyplanet.com/foo")
          });

          it("refreshes the buttons and updates the url", function() {

          });
        });

        describe("and haven't already been loaded", function() {
          beforeEach(function() {
            loadFixtures("socialToolbar.html");
            window.socialToolbar = new SocialToolbar({ el: "#js-social-not-to-be-displayed" });
            spyOn(window.socialToolbar, "_shouldLoadButtons").andReturn(true);
            spyOn(window.socialToolbar, "getUrl").andReturn("http://www.lonelyplanet.com/foo");
            $("#js-row--content").trigger(":page/received");
          });

          it("updates the url on the mailto link", function() {
            var newUrl = $("#js-social-not-to-be-displayed").find(".js-mailto-link").attr("href");
            expect(newUrl).toContain("http://www.lonelyplanet.com/foo");
          });

          it("it loads and displays them", function() {
            expect($("#js-social-not-to-be-displayed")).not.toHaveClass("is-hidden");
            expect(window.socialToolbar.proximityLoader.config.el).toBe("#js-social-not-to-be-displayed");
            expect(window.socialToolbar.proximityLoader.config.list).toBe("#js-facebook-like, #js-tweet, #js-google-plus")
          });
        });
      });
    });
  });
});
