require([ "jquery", "public/assets/javascripts/lib/core/authenticator" ], function($, Authenticator) {

  "use strict";

  describe("Authenticator", function() {

    var auth,
        lp = {},
        loggedInStatus;

    loggedInStatus = {
      id: 1,
      username: "foobar",
      email: "foo@bar.com",
      profileSlug: "foobar",
      facebookUid: null,
      avatar: "/foo.jpg",
      timestamp: "2014-03-31T14:33:47+01:00",
      unreadMessageCount: 5
    };

    $("body").append("<div id='js-user-nav-template' />");

    beforeEach(function() {
      var $fixtures;

      loadFixtures("authenticator.html");
      $("#js-user-nav-template").html($("#jasmine-fixtures").html());

      // We don't need to test the actual ajax request, and this now being a `jsonp` request, it breaks Phantom.
      spyOn($, "ajax").andReturn("");

      auth = new Authenticator();
    });

    describe("config", function() {

      it("always checks the status from the live site", function() {
        expect(auth.statusUrl).toBe("https://www.lonelyplanet.com/thorntree/users/status");
      });

    });

    describe("signed out", function() {

      beforeEach(function() {
        auth._updateStatus();
      });

      it("generates the sign in / join links for both mobile and wide views", function() {
        expect($(".js-user-sign_in").length).toBe(2);
        expect($(".js-user-sign_up").length).toBe(2);
      });

      it("defines all link urls correctly", function() {
        expect($(".js-user-sign_in").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/users/sign_in");
        expect($(".js-user-sign_up").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/users/sign_up");
      });

    });

    describe("updating signed in status", function() {

      beforeEach(function() {
        auth._updateStatus(loggedInStatus);
      });

      it("sets up window.lp.user", function() {
        expect(window.lp.user).toBe(loggedInStatus);
      });

    });

    describe("signed in", function() {

      beforeEach(function() {
        auth._updateStatus(loggedInStatus);
      });

      it("shows user's avatar", function() {
        expect($(".nav__item--user-avatar").attr("src")).toBe("/foo.jpg");
      });

      it("adds username to the dropdown menu", function() {
        expect($(".nav__submenu__title--user-name").text().trim()).toBe("foobar");
      });

      it("adds user name to the responsive menu", function() {
        expect($(".nav--offscreen__title").text()).toBe("foobar");
      });

      it("adds user email address to the dropdown menu", function() {
        expect($(".nav__submenu__title--user-email").text()).toBe("foo@bar.com");
      });

      it("adds settings icon link to the dropdown menu", function() {
        expect($(".js-user-settings").length).toBe(1);
      });

      it("adds responsive menu items", function() {
        expect($(".wv--nav--inline .nav__item").length).toBe(5);
      });

      it("defines all drop-down menu link urls correctly", function() {
        expect($(".js-user-profile").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/profiles/foobar");
        expect($(".js-user-settings").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/forums/settings");
        expect($(".js-user-sign_out").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/users/sign_out");
      });

    });

    describe("unread message", function() {

      beforeEach(function() {
        loggedInStatus.unreadMessageCount = 5;
        auth._updateStatus(loggedInStatus);
      });

      it("shows the number of unread messages in the responsive menu", function() {
        expect($(".js-responsive-unread-messages:visible").text().trim()).toBe("(5)");
      });

    });

  });

});
