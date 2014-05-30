require([ "jquery", "public/assets/javascripts/lib/core/authenticator" ], function($, Authenticator) {

  "use strict";

  describe("Authenticator", function() {

    var auth,
        lp = {},
        loggedInStatus;

    loggedInStatus = {
      id: 1,
      username: "foobar",
      profileSlug: "foobar",
      facebookUid: null,
      avatar: "/foo.jpg",
      timestamp: "2014-03-31T14:33:47+01:00",
      unreadMessageCount: 0
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
        expect($(".js-user-sign_in").attr("href")).toBe("https://auth.lonelyplanet.com/users/sign_in");
        expect($(".js-user-sign_up").attr("href")).toBe("https://auth.lonelyplanet.com/users/sign_up");
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

      it("shows the user's avatar", function() {
        expect($(".nav__item--user-avatar").attr("src")).toBe("/foo.jpg");
      });

      it("adds the username to the dropdown menu", function() {
        expect($(".nav__submenu__title").text()).toBe("foobar");
      });

      it("adds the username to the responsive menu", function() {
        expect($(".nav--offscreen__title").text()).toBe("foobar");
      });

      it("adds all the dropdown menu items", function() {
        expect($(".nav__submenu__link").length).toBe(5);
      });

      it("adds the responsive menu items", function() {
        expect($(".wv--nav--inline .nav__item").length).toBe(5);
      });

      it("defines all link urls correctly", function() {
        expect($(".js-user-activities").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/profiles/foobar/activities");
        expect($(".js-user-messages").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/profiles/foobar/messages");
        expect($(".js-user-profile").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/profiles/foobar");
        expect($(".js-user-settings").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/forums/settings");
        expect($(".js-user-sign_out").attr("href")).toBe("https://auth.lonelyplanet.com/users/sign_out");
      });

    });

    describe("unread message", function() {

      beforeEach(function() {
        loggedInStatus.unreadMessageCount = 5;
        auth._updateStatus(loggedInStatus);
      });

      it("shows the notification badge with the number of unread messages in it", function() {
        expect($(".notification-badge:visible").text()).toBe("5");
      });

      it("shows the number of unread messages on the submenu item", function() {
        expect($(".nav__submenu__notification:visible").text()).toBe("5");
      });

    });

  });

});
