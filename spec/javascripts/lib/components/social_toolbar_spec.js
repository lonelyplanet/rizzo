define([ "jquery", "public/assets/javascripts/lib/components/social_toolbar.js" ], function($, SocialToolbar) {

  "use strict";

  describe("SocialToolbar", function() {

    var newUrl = "http://www.lonelyplanet.com/bar",
        encodedNewUrl = encodeURIComponent(newUrl);

    beforeEach(function() {
      loadFixtures("social_toolbar.html");
      window.socialToolbar = new SocialToolbar();
      spyOn(window.socialToolbar, "getUrl").and.returnValue(newUrl);
    });

    describe("Toggling visibility", function() {
      describe("when displaySocial is true", function() {
        beforeEach(function() {
          $(".js-social-toolbar").addClass("is-hidden");
          $("#js-row--content").trigger(":page/received", {displaySocial: true});
        });

        it("it displays the buttons", function() {
          expect($(".js-social-toolbar")).not.toHaveClass("is-hidden");
        });
      });

      describe("when displaySocial is true and it's already visible", function() {
        beforeEach(function() {
          $("#js-row--content").trigger(":page/received", {displaySocial: true});
        });

        it("it displays the buttons", function() {
          expect($(".js-social-toolbar")).not.toHaveClass("is-hidden");
        });
      });

      describe("when displaySocial is false", function() {
        beforeEach(function() {
          $("#js-row--content").trigger(":page/received", {displaySocial: false});
        });

        it("it doesn't display the buttons", function() {
          expect($(".js-social-toolbar")).toHaveClass("is-hidden");
        });
      });
    });

    describe("After a new page is received", function() {

      beforeEach(function() {
        $("#js-row--content").trigger(":page/received", {displaySocial: true, copy: {title: "New article"}});
      });

      it("we update each link", function() {
        var shares = window.socialToolbar.shares, i = 0;
        for (i; i < shares.length; i++) {

          expect($(".js-" + shares[i].name + "-share").attr("href"))
            .toContain(
              (shares[i].hasMeta ? "" : shares[i].separator + "=") +
              (shares[i].encodeURI ? encodedNewUrl : newUrl)
            );
        }
      });

      it("we update each google analytics label", function() {
        var shares = window.socialToolbar.shares, i = 0;
        for (i; i < shares.length; i++) {
          expect($(".js-" + shares[i].name + "-share").attr("data-lpa-label")).toBe(newUrl);
        }
      });

      it("we update the mailto subject", function() {
        expect($(".js-mailto-share").attr("href")).toContain("New article");
      });

      it("we update the twitter generated content", function() {
        expect($(".js-twitter-share").attr("href")).toContain("New article");
      });


    });

  });
});
