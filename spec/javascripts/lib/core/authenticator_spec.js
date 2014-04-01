require([ "jquery", "public/assets/javascripts/lib/core/authenticator" ], function($, Authenticator) {

  "use strict";

  describe("Authenticator", function() {

    var auth,
        lp = {};

    beforeEach(function() {
      localStorage.removeItem("lp-uname");
    });

    describe("signed out", function() {

      beforeEach(function() {
        auth = new Authenticator();
      });

      it("generates the sign in / join links", function() {
        expect($(".js-user-signin").length).toBe(1);
        expect($(".js-user-signup").length).toBe(1);
      });

    });

    describe("updating signed in status", function() {

      var userStatus = {
        id: 1,
        username: "foobar",
        profileSlug: "foobar",
        facebookUid: null,
        avatar: "/foo.jpg",
        timestamp: "2014-03-31T14:33:47+01:00",
        unreadMessageCount: 0
      };

      Authenticator.prototype._updateStatus(userStatus);

      it("sets up window.lp.user", function() {
        expect(window.lp.user).toBe(userStatus);
      });

    });

    describe("signed in", function() {

      beforeEach(function() {
        auth = new Authenticator();
      });

      it("shows the user's avatar", function() {
        expect($(".nav__item--avatar").length).toBe(1);
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

    });

    describe("unread message", function() {

      lp.user.unreadMessageCount = 5;

      beforeEach(function() {
        auth = new Authenticator();
      });

      it("shows the notification badge with the number of unread messages in it", function() {
        expect($(".notification-badge").length).toBe(1);
        expect($(".notification-badge").text()).toBe(5);
      });

      it("shows the number of unread messages on the submenu item", function() {
        expect($(".nav__submenu__notification").length).toBe(1);
        expect($(".nav__submenu__notification").text()).toBe(5);
      });

    });

    describe("URLs", function() {

      it("always checks the status from the live site", function() {
        expect(auth.getStatusUrl()).toBe("//www.lonelyplanet.com/thorntree/users/status");
      });

      it("defines all urls correctly", function() {
        expect(auth.urls.activities).toBe("/thorntree/profiles/foobar/activities");
        expect(auth.urls.messages).toBe("/thorntree/profiles/foobar/messages");
        expect(auth.urls.profile).toBe("/thorntree/profiles/foobar");
        expect(auth.urls.settings).toBe("/thorntree/forums/settings");
        expect(auth.urls.signIn).toBe("/thorntree/users/sign_in");
        expect(auth.urls.signOut).toBe("/thorntree/users/sign_out");
        expect(auth.urls.signUp).toBe("/thorntree/users/sign_up");
      });

    });

  });

});
