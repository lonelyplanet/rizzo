require([ "jquery", "public/assets/javascripts/lib/core/authenticator" ], function($, Authenticator) {

  "use strict";

  describe("Authenticator", function() {

    var auth,
        loggedInStatus;

    loggedInStatus = {
      id: 1,
      username: "foobar",
      email: "foo@bar.com",
      profileSlug: "12345",
      facebookUid: null,
      avatar: "/foo.jpg",
      timestamp: "2014-03-31T14:33:47+01:00",
    };

    beforeEach(function() {
      loadFixtures("authenticator.html");
      $("#jasmine-fixtures").append("<div id='js-user-nav-template' />");
      $("#js-user-nav-template").html($("#jasmine-fixtures").html());

      // We don't need to test the actual ajax request, and this now being a `jsonp` request, it breaks Phantom.
      spyOn($, "ajax").andReturn("");

      auth = new Authenticator();
    });

    describe("config", function() {

      it("should check the status from the live site", function() {
        expect(auth.statusUrl).toBe("https://auth.lonelyplanet.com/users/status.json");
      });

    });

    describe("signed out", function() {

      beforeEach(function() {
        auth._updateStatus();
      });

      it("should generate the sign in / join links for both mobile and wide views", function() {
        expect($(".js-user-sign_in").length).toBe(2);
        expect($(".js-user-sign_up").length).toBe(2);
      });

      it("should define all link urls correctly", function() {
        expect($(".js-user-sign_in").attr("href")).toBe("https://auth.lonelyplanet.com/users/sign_in");
        expect($(".js-user-sign_up").attr("href")).toBe("https://auth.lonelyplanet.com/users/sign_up");
      });

    });

    describe("updating signed in status", function() {

      beforeEach(function() {
        auth._updateStatus(loggedInStatus);
      });

      it("should set up window.lp.user", function() {
        expect(window.lp.user).toBe(loggedInStatus);
      });

    });

    describe("signed in", function() {

      beforeEach(function() {
        auth._updateStatus(loggedInStatus);
      });

      it("should show user's avatar", function() {
        expect($(".nav__item--user-avatar").attr("src")).toBe("/foo.jpg");
      });

      it("should define all drop-down menu link urls correctly", function() {
        expect($(".js-user-profile").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/profiles/" + loggedInStatus.profileSlug);
        expect($(".js-user-settings").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/forums/settings");
        expect($(".js-user-sign_out").attr("href")).toBe("https://auth.lonelyplanet.com/users/sign_out");
      });

      it("should add user name to the responsive menu", function() {
        expect($(".nav--offscreen__title").text()).toBe("foobar");
      });

      it("should add responsive menu items", function() {
        expect($(".js-user-signed-in .nav__item").length).toBe(5);
      });

      it("should define responsive menu link urls correctly", function() {
        var $respMenu = $(".js-user-signed-in .nav__item");

        expect($respMenu.eq(0).attr("href")).toBe("https://www.lonelyplanet.com/thorntree/profiles/" + loggedInStatus.profileSlug);
        expect($respMenu.eq(1).attr("href")).toBe("https://www.lonelyplanet.com/thorntree/forums/settings");
        expect($respMenu.eq(2).attr("href")).toBe("https://www.lonelyplanet.com/thorntree/profiles/" + loggedInStatus.profileSlug + "/messages");
        expect($respMenu.eq(3).attr("href")).toBe("https://www.lonelyplanet.com/thorntree/profiles/" + loggedInStatus.profileSlug + "/activities");
        expect($respMenu.eq(4).attr("href")).toBe("https://auth.lonelyplanet.com/users/sign_out");
      });

    });

  });

});
