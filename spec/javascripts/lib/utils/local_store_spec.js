require([ "lib/utils/local_store" ], function(LocalStore) {

  "use strict";

  describe("LocalStore", function() {
    var ls;

    beforeEach(function() {
      ls = new LocalStore();
    });

    describe("Functionality", function() {

      describe("Local storage is supported", function() {

        beforeEach(function() {
          window.lp.supports.localStorage = true;
        });

        describe("set()", function() {

          beforeEach(function() {
            spyOn(localStorage, "setItem");
            ls.set("rob", "duck", 1, "duckland.pl", "/ducks");
          });

          it("should call localStorage.setItem() with proper params", function() {
            expect(localStorage.setItem).toHaveBeenCalledWith("rob", "duck");
          });
        });

        describe("get()", function() {

          beforeEach(function() {
            spyOn(localStorage, "getItem");
            ls.get("rob");
          });

          it("should call localStorage.getItem() with proper param", function() {
            expect(localStorage.getItem).toHaveBeenCalledWith("rob");
          });
        });

        describe("remove()", function() {

          beforeEach(function() {
            spyOn(localStorage, "removeItem");
            ls.remove("rob");
          });

          it("should call localStorage.removeItem() with proper param", function() {
            expect(localStorage.removeItem).toHaveBeenCalledWith("rob");
          });
        });
      });

      describe("Local storage is not supported", function() {

        beforeEach(function() {
          window.lp.supports.localStorage = false;
        });

        describe("set()", function() {

          beforeEach(function() {
            spyOn(ls, "setCookie");
            ls.set("rob", "duck", 1);
          });

          it("should call .setCookie() with proper params", function() {
            expect(ls.setCookie).toHaveBeenCalledWith("rob", "duck", 1);
          });
        });

        describe("get()", function() {

          beforeEach(function() {
            spyOn(ls, "getCookie");
            ls.get("rob");
          });

          it("should call .getCookie() with proper param", function() {
            expect(ls.getCookie).toHaveBeenCalledWith("rob");
          });
        });

        describe("remove()", function() {

          beforeEach(function() {
            spyOn(ls, "removeCookie");
            ls.remove("rob", "duckland.pl", "/ducks");
          });

          it("should call .removeCookie() with proper params", function() {
            expect(ls.removeCookie).toHaveBeenCalledWith("rob");
          });
        });
      });

      describe("Cookies management", function() {
        var getTimeBackup = Date.prototype.getTime;

        // This is a simple trick to always get the same date.
        beforeEach(function() {
          Date.prototype.getTime = function() { return 0; };
        });

        afterEach(function() {
          Date.prototype.getTime = getTimeBackup;
        });

        describe("setCookie()", function() {

          it("should return session cookie string if no 'days' specified or equal 0", function() {
            expect(ls.setCookie("rob", "duck")).toEqual("rob=duck;path=/");
            expect(ls.setCookie("rob", "duck", 0, "duckland.pl", "/ducks"))
              .toEqual("rob=duck;domain=duckland.pl;path=/ducks");
          });

          it("should return valid cookie string with proper date, domain & path if specified", function() {
            expect(ls.setCookie("rob", "duck", 1, "duckland.pl", "/ducks"))
              .toEqual("rob=duck;expires=Fri, 02 Jan 1970 00:00:00 GMT;domain=duckland.pl;path=/ducks");
          });
        });

        describe("getCookie()", function() {

          it("should return proper cookie value for given key", function() {
            expect(ls.getCookie("madonna", "rob=duck;madonna=rabbit")).toEqual("rabbit");
          });
        });

        describe("removeCookie()", function() {

          it("should return proper cookie deletion string", function() {
            expect(ls.removeCookie("rob")).toEqual("rob=;expires=Wed, 31 Dec 1969 00:00:00 GMT;path=/");
          });
        });
      });
    });
  });
});
